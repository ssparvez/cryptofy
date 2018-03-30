import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { WalletsPage } from '../wallets/wallets';
import { Transaction } from '../../models/transaction';


@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  transactionCollection: AngularFirestoreCollection<Transaction>;
  transactions: Observable<Transaction[]>;

  chart = {
    type: 'doughnut',
    labels: ['Bitcoin', 'Ethereum', 'Litecoin', 'Bitcoin Cash'],
    data: [8940000, 5000000, 1000000, 300000],
    colors:  [{ backgroundColor: ['#5628B4', '#D80E70', '#E7455F', '#F7B236'] }],
    options: {
      legend: { display: false },
      cutoutPercentage: 75,
      animation: { animateScale: true }
    }
  }

  showSpinner = true;

  constructor(public navCtrl: NavController, public db: AngularFirestore, public auth: AuthService) {
    this.auth.user.subscribe((user)=> {
      console.log(user.uid);
      this.showSpinner = false;
      this.transactionCollection = this.db.collection('transactions', ref => ref.where('userId', '==', user.uid));
      this.transactions = this.transactionCollection.valueChanges();
      console.log(this.transactions);
      this.transactions.subscribe((val) => {
        // calculate values
        val.forEach((transaction)=> console.log(transaction));
      })
    });
    // check out https://coursetro.com/posts/code/126/Let's-build-an-Angular-5-Chart.js-App---Tutorial
    // to hook up api data
    
  }
  ionViewDidLoad() {
    
  }
  ionViewWillEnter() {
  }

  displayWallets() {
    this.navCtrl.push(WalletsPage);
  }
}