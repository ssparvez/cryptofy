import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CryptoProvider } from '../../providers/cryptodata';
import { NewsPage } from '../news/news';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  coins: any;
  currency = "usd";

  constructor(public navCtrl: NavController, private dataProvider: CryptoProvider, public storage: Storage) {
   
  }
  // on page load
  ionViewWillEnter() {
     // load coin market cap data
     this.dataProvider.getCoinList().subscribe(data => {
      console.log(data);
      this.coins = data;
      // load the currency preference
      this.storage.ready().then(()=> {
        this.storage.get('currency').then((val) => {
          console.log('Your curr is', val);
          // problem when storage value not set
          //this.currency = val; 
        })
      });
    });
  }

  // on page refresh
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.dataProvider.getCoinList().subscribe(data => {
      console.log(data);
      this.coins = data
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }

  openNewsPage(coin){
    // push another page onto the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.navCtrl.push(NewsPage, {
      coin: coin
    });
  }

}
