import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { CoinSelectionPage } from '../coin-selection/coin-selection';
import { Holding } from '../../models/holding';
import { CryptoProvider } from '../../providers/cryptodata';
import { HoldingInfoPage } from '../holding-info/holding-info';


@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  holdingCollection: AngularFirestoreCollection<Holding>;
  holdings: Observable<Holding[]>;

  chart = {
    type: 'doughnut',
    labels: [],
    data: [],
    colors:  [{ backgroundColor: ['#5628B4', '#AA00FF', '#FF1744', '#FF9800', '#FFEB3B', '#64DD17', '#00BFA5', '#448AFF'] }],
    options: {
      legend: { display: false },
      cutoutPercentage: 80,
      animation: { animateScale: true }
    }
  }

  showSpinner = true;
  totalValue = 0;
  coinSymbols = [];

  constructor(public navCtrl: NavController, public db: AngularFirestore, public auth: AuthService, public cryptoProvider: CryptoProvider) {
    this.auth.user.subscribe((user)=> {
      this.showSpinner = false;
      console.log(user.uid);
      console.log(user);
      this.holdingCollection = this.db.collection('holdings', ref => ref.where('userId', '==', user.uid));
      // use snapshot changes to get id of each doc for deletion
      this.holdings = this.holdingCollection.snapshotChanges().map(changes => {
         return changes.map((a, index) => {
           const data = a.payload.doc.data() as Holding;
           data.id = a.payload.doc.id;
           data.index = index;
           return data;
         })
      });
      this.holdings.subscribe((val) => {
        // calculate values
        this.coinSymbols = [];
        // collect symbols to query cryptocompare api
        val.forEach(holding => {
          console.log(holding);
          this.coinSymbols.push(holding.coinSymbol);
        });
        this.cryptoProvider.getPortfolioCoins(this.coinSymbols).subscribe(data => {
          console.log(data);
          this.chart.data = [];
          this.totalValue = 0;
          val.forEach(holding => {
            let price = data['DISPLAY'][holding.coinSymbol]['USD']['PRICE'].replace('$ ', '').replace(',', '');
            console.log(parseFloat(price));
            holding.value = holding.amount * parseFloat(price); // calculate current value
            this.totalValue += holding.value;
            console.log(holding.coinName + " value: " + holding.value);
            this.chart.data.push(holding.value.toFixed(2));
            this.chart.labels.push(holding.coinName);
          });
        });
      });
    });
  }
  ionViewDidLoad() {
    
  }
  ionViewWillEnter() {
  }

  displayWallets() {
    this.navCtrl.push(CoinSelectionPage, { coinSymbols: this.coinSymbols});
  }

  displayHoldingInfo(holding) {
    let coin = {
      name: holding.coinName,
      symbol: holding.coinSymbol
    }
    this.navCtrl.push(HoldingInfoPage, {coin, amount: holding.amount, type: 'Edit', holdingId: holding.id});
  }

  removeHolding(holding) {
    console.log(holding);
    this.holdings.subscribe((val) => val.filter(item => item.id !== holding.id));
    this.db.doc(`holdings/${holding.id}`).delete();
  }
}