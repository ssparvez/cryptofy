import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../../core/auth.service';
import { CoinSelectionPage } from '../coin-selection/coin-selection';
import { Holding } from '../../models/holding';
import { DataProvider } from '../../providers/data-provider';
import { HoldingInfoPage } from '../holding-info/holding-info';
import { SettingsProvider } from '../../providers/settings-provider';
import { User } from '../../models/user';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { LoginPage } from '../login/login';
import { PremiumProvider } from '../../providers/premium-provider';
import { PremiumPage } from '../premium/premium';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  holdingCollection: AngularFirestoreCollection<Holding>;
  holdings: Holding[] = [];
  sorted: boolean = false;

  chart = {
    type: 'doughnut',
    labels: [],
    data: [],
    colors: [{ backgroundColor: ['#5628B4', '#AA00FF', '#FF1744', '#FF9800', '#FFEB3B', '#64DD17', '#00BFA5', '#448AFF'] }],
    options: {
      legend: { display: false },
      cutoutPercentage: 80,
      animation: { animateScale: true },
      elements: { arc: { borderWidth: 0 } },
      tooltips: { enabled: false }
    }
  }

  showSpinner = true;
  totalValue = 0;
  coinSymbols = [];
  currency: String = 'USD';
  activeIndex = -1; // for arc tap

  fingerprintOptions = {
    clientId: 'Fingerprint-Demo',
    clientSecret: 'password', //Only necessary for Android
    disableBackup: true //Only for Android(optional))
  }

  showFingerprint: Boolean = false;
  isPremium: Boolean = false;
  wasPaused = true;

  constructor(public navCtrl: NavController, public db: AngularFirestore, public auth: AuthService, 
    public dataProvider: DataProvider, private settingsProvider: SettingsProvider, private premiumProvider: PremiumProvider,
    public actionSheetCtrl: ActionSheetController, private fingerprintAIO: FingerprintAIO, private platform: Platform) {
      this.settingsProvider.getCurrency().subscribe(val => this.currency = val);
      this.premiumProvider.getPremium().subscribe(val => this.isPremium = val);
      this.platform.resume.subscribe(() => this.wasPaused = true);
  }
  
  ionViewWillEnter() {
    this.openFingerprintDialog();
    this.showSpinner = true;
    this.auth.user
      .switchMap(user => this.getHoldings(user))
      .switchMap(holdings => this.retrieveHoldingPrices(holdings))
      .subscribe(data => this.calculateHoldingValues(data), err => {});
  }
  
  openFingerprintDialog() {
    this.settingsProvider.getFingerprint().subscribe(fingerprintToggled => {
      if(fingerprintToggled && this.wasPaused) {
        this.showFingerprint = true;
        this.wasPaused = false;
        this.fingerprintAIO.show(this.fingerprintOptions).then(() => this.showFingerprint = false);
      }
    }).unsubscribe(); // to prevent trigger from another page
  }

  getHoldings(user: User) {
    console.log(user);
    if(user != null) {
      this.holdingCollection = this.db.collection('holdings', ref => ref.where('userId', '==', user.uid));
      return this.holdingCollection.snapshotChanges().map(changes => {
        return changes.map(a => { // use snapshot changes to get id for deletion
          const holding = a.payload.doc.data() as Holding;
          holding.id = a.payload.doc.id;
          return holding;
        })
      });
    }
    else this.showSpinner = false
  }

  retrieveHoldingPrices(holdings: Holding[]) {
    this.holdings = holdings;
    console.log(holdings);
    if(holdings.length > 0) {
      this.sorted = false;
      this.coinSymbols = holdings.map(holding => holding.coin.symbol);
      return this.dataProvider.getPortfolioCoins(this.coinSymbols, this.currency);
    }
    else this.showSpinner = false;
  }

  calculateHoldingValues(data: any) {
    console.log(data);
    this.totalValue = 0;
    this.chart.data = [];
    this.holdings.forEach(holding => { // calculate values
      const price = data['DISPLAY'][holding.coin.symbol][this.currency.toString()]['PRICE'].replace(/[^0-9\.-]+/g, "");
      holding.value = holding.amount * parseFloat(price); // calculate current value
      this.totalValue += holding.value;
    });
    this.holdings.sort((a, b) => b.value - a.value); // sort holdings descending
    this.sorted = true;
    this.chart.data = this.holdings.map(holding => parseFloat(holding.value.toFixed(2)))
    this.showSpinner = false; // might have to move this
    console.log(this.chart.data);
  }

   // events
   public chartClicked(e: any): void {
     if(e.active.length > 0) {
       console.log(e.active[0]._index);
       this.activeIndex = e.active[0]._index;
       setTimeout(() => this.activeIndex = -1, 500);
     }
  }

  openCoinSelectionPage() {
    this.navCtrl.push(CoinSelectionPage, { coinSymbols: this.coinSymbols });
  }

  openHoldingOptions(holding, index) {
    let actionSheet = this.actionSheetCtrl.create({
      title: `${holding.coin.name} Holding Options`,
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => this.openHoldingInfoPage(holding)
        },
        {
          text: 'Remove',
          icon: 'remove',
          role: 'destructive',
          handler: () => this.removeHolding(holding, index)
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => console.log('Cancel clicked')
        }
      ]
    });
    actionSheet.present();
  }
  
  openHoldingInfoPage(holding) {
    this.navCtrl.push(HoldingInfoPage, {
      coin: {
        name: holding.coin.name,
        symbol: holding.coin.symbol
      },
      amount: holding.amount,
      type: 'Edit',
      holdingId: holding.id
    });
  }

  removeHolding(holding, index) {
    console.log("removeing " + holding);
    this.db.doc(`holdings/${holding.id}`).delete();
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  openPremiumPage() {
    this.navCtrl.push(PremiumPage);
  }
}
