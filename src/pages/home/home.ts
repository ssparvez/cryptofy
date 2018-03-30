import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private dataProvider: CryptoProvider, public storage: Storage, public toastCtrl: ToastController) {
   
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
      this.coins = data;
      
    },
    error => {
      console.log("Error: ", error);
      refresher.complete();
      let toast = this.toastCtrl.create({
        message: "Can't retrieve data",
        duration: 3000,
        position: "top"
      });
      toast.present();
    },
    () => {
      console.log("Async operation has ended");
      refresher.complete();
    });
  }

  openNewsPage(coin) {
    // push another page onto the navigation stack
    this.navCtrl.push(NewsPage, {coin: coin});
  }
}
