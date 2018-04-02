import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { WalletsPage } from '../wallets/wallets';
import { Holding } from '../../models/holding';
import { CryptoProvider } from '../../providers/cryptodata';


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
    colors:  [{ backgroundColor: ['#5628B4', '#D80E70', '#E7455F', '#F7B236'] }],
    options: {
      legend: { display: false },
      cutoutPercentage: 75,
      animation: { animateScale: true }
    }
  }

  showSpinner = true;
  totalValue = 0;

  constructor(public navCtrl: NavController, public db: AngularFirestore, public auth: AuthService, public cryptoProvider: CryptoProvider) {
    this.auth.user.subscribe((user)=> {
      this.showSpinner = false;
      console.log(user.uid);
      this.holdingCollection = this.db.collection('holdings', ref => ref.where('userId', '==', user.uid));
      // use snapshot changes to get id of each doc for deletion
      this.holdings = this.holdingCollection.snapshotChanges().map(changes => {
         return changes.map(a => {
           const data = a.payload.doc.data() as Holding;
           data.id = a.payload.doc.id;
           return data;
         })
      });
      console.log(this.holdings);
      this.holdings.subscribe((val) => {
        // calculate values
        let coinSymbols = [];
        // collect symbols to query cryptocompare api
        val.forEach(holding => {
          console.log(holding);
          coinSymbols.push(holding.coinSymbol);
          holding.value = 12321;
        });
        this.cryptoProvider.getPortfolioCoins(coinSymbols).subscribe(data => {
          console.log(data);
          this.chart.data = [];
          this.totalValue = 0;
          val.forEach(holding => {
            let price = data['DISPLAY'][holding.coinSymbol]['USD']['PRICE'].replace('$ ', '').replace(',', '');
            console.log(parseFloat(price));
            holding.value = holding.amount * parseFloat(price); // calculate current value
            this.totalValue += holding.value;
            console.log(holding.coinName + " value: " + holding.value);
            this.chart.data.push(holding.value);
            this.chart.labels.push(holding.coinName);

          });
        });
      })
    });
  }
  ionViewDidLoad() {
    
  }
  ionViewWillEnter() {
  }

  displayWallets() {
    this.navCtrl.push(WalletsPage);
  }

  removeHolding(holding) {
    console.log(holding);
    this.db.doc(`holdings/${holding.id}`).delete();
  }
}