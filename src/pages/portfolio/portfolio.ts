import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { CoinSelectionPage } from '../coin-selection/coin-selection';
import { Holding } from '../../models/holding';
import { DataProvider } from '../../providers/data-provider';
import { HoldingInfoPage } from '../holding-info/holding-info';
import { EmailLoginPage } from '../email-login/email-login';


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
    colors: [{
      backgroundColor: ['#5628B4', '#AA00FF', '#FF1744', '#FF9800', '#FFEB3B', '#64DD17', '#00BFA5', '#448AFF']
    }],
    options: {
      legend: {
        display: false
      },
      cutoutPercentage: 80,
      animation: {
        animateScale: true
      },
      elements: {
        arc: {
          borderWidth: 0
        }
      }
    }
  }

  showSpinner = true;
  totalValue = 0;
  coinSymbols = [];

  constructor(public navCtrl: NavController, public db: AngularFirestore, public auth: AuthService, public dataProvider: DataProvider) {
  }
  
  ionViewWillEnter() {
    this.auth.user.subscribe(user => {
      this.showSpinner = false; // might have to move this
      console.log(user);
      if(user) {
        this.holdingCollection = this.db.collection('holdings', ref => ref.where('userId', '==', user.uid));
        this.holdings = this.holdingCollection.snapshotChanges().map(changes => {
          return changes.map((a) => { // use snapshot changes to get id for deletion
            const data = a.payload.doc.data() as Holding;
            data.id = a.payload.doc.id;
            return data;
          })
        });
        this.calculateHoldings();
      }
    });
  }

  calculateHoldings() {
    this.holdings.subscribe(holdings => {
      if(holdings.length > 0) {
        this.coinSymbols = []; // collect symbols to query cryptocompare api
        console.log(holdings);
        holdings.forEach(holding => this.coinSymbols.push(holding.coin.symbol));
        this.dataProvider.getPortfolioCoins(this.coinSymbols).subscribe(data => {
          console.log(data);
          this.chart.data = [];
          this.totalValue = 0;
          holdings.forEach(holding => { // calculate values
            const price = data['DISPLAY'][holding.coin.symbol]['USD']['PRICE'].replace('$ ', '').replace(',', '');
            holding.value = holding.amount * parseFloat(price); // calculate current value
            this.totalValue += holding.value;
            this.chart.data.push(holding.value.toFixed(2));
            this.chart.labels.push(holding.coin.name);
            console.log(holding.value);
          });
        });
      }
    });
  }

  displayWallets() {
    this.navCtrl.push(CoinSelectionPage, { coinSymbols: this.coinSymbols });
  }

  openEmailLoginPage(toCreateAccount) {
    this.navCtrl.push(EmailLoginPage);
  }

  displayHoldingInfo(holding) {
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

  removeHolding(holding) {
    console.log(holding);
    this.coinSymbols = this.coinSymbols.filter(item => item !== holding.coinSymbol);
    console.log(this.coinSymbols);
    this.db.doc(`holdings/${holding.id}`).delete();
  }
}
