import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
//import { Observable } from 'rxjs/Observable';
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
  //holdings: Observable<Holding[]>;
  holdings: Holding[] = [];

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
    this.auth.user
      .switchMap(user => this.getHoldings(user))
      .switchMap(holdings => this.retrieveHoldingPrices(holdings))
      .subscribe(data => this.calculateHoldingValues(data), err => console.log(err));

    // this.auth.user.subscribe(user => {
    //   this.showSpinner = false; // might have to move this
    //   console.log(user);
    //   if(user) {
    //     this.holdingCollection = this.db.collection('holdings', ref => ref.where('userId', '==', user.uid));
    //     this.holdings = this.holdingCollection.snapshotChanges().map(changes => {
    //       return changes.map((a) => { // use snapshot changes to get id for deletion
    //         const holding = a.payload.doc.data() as Holding;
    //         holding.id = a.payload.doc.id;
    //         return holding;
    //       })
    //     });
    //     this.calculateHoldings();
    //   }
    // });
  }

  // calculateHoldings() {
  //   this.holdings.subscribe(holdings => {
  //     if(holdings.length > 0) {
  //       console.log(holdings);
  //       this.coinSymbols = holdings.map(holding => holding.coin.symbol);
  //       this.dataProvider.getPortfolioCoins(this.coinSymbols).subscribe(data => {
  //         console.log(data);
  //         this.totalValue = 0;
  //         this.chart.data = holdings.map(holding => { // calculate values
  //           const price = data['DISPLAY'][holding.coin.symbol]['USD']['PRICE'].replace(/[^0-9\.-]+/g, "");
  //           const holdingValue = holding.amount * parseFloat(price); // calculate current value
  //           this.totalValue += holdingValue;
  //           this.chart.labels.push(holding.coin.name);
  //           return parseFloat(holdingValue.toFixed(2));
  //         });
  //         console.log(this.chart.data);
  //       });
  //     }
  //   });
  // }

  getHoldings(user) {
    console.log(user);
    if(user != null) {
      this.holdingCollection = this.db.collection('holdings', ref => ref.where('userId', '==', user.uid));
      return this.holdingCollection.snapshotChanges().map(changes => {
        return changes.map((a) => { // use snapshot changes to get id for deletion
          const holding = a.payload.doc.data() as Holding;
          holding.id = a.payload.doc.id;
          console.log("what up");
          return holding;
        })
      });
    }
    else this.showSpinner = false
  }

  retrieveHoldingPrices(holdings) {
    this.holdings = holdings;
    console.log(holdings);
    this.showSpinner = false; // might have to move this
    if(holdings.length > 0) {
      this.coinSymbols = holdings.map(holding => holding.coin.symbol);
      return this.dataProvider.getPortfolioCoins(this.coinSymbols);
    }
  }

  calculateHoldingValues(data) {
    console.log(data);
    this.totalValue = 0;
    this.chart.data = this.holdings.map(holding => { // calculate values
      const price = data['DISPLAY'][holding.coin.symbol]['USD']['PRICE'].replace(/[^0-9\.-]+/g, "");
      const holdingValue = holding.amount * parseFloat(price); // calculate current value
      this.totalValue += holdingValue;
      this.chart.labels.push(holding.coin.name);
      return parseFloat(holdingValue.toFixed(2));
    });
    console.log(this.chart.data);
  }

  openCoinSelectionPage() {
    this.navCtrl.push(CoinSelectionPage, { coinSymbols: this.coinSymbols });
  }

  openEmailLoginPage(toCreateAccount) {
    this.navCtrl.push(EmailLoginPage);
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
}
