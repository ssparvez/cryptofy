import { Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController } from 'ionic-angular';
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

  showSpinner = true;

  constructor(public navCtrl: NavController, private dataProvider: CryptoProvider, public storage: Storage, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {
  }
  // on page load
  ionViewWillEnter() {
     // load coin market cap data
     this.dataProvider.getCoinList().subscribe(data => {
      this.showSpinner = false;
      console.log(data);
      this.coins = data;
      // load the currency preference
      this.storage.ready().then(() => {
        this.storage.get('currency').then((val) => {
          console.log('Your curr is', val);
          // problem when storage value not set
          //this.currency = val; 
        })
      });
    });
  }

  // on page refresh
  refreshCoinList(refresher) {
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

  addToFavorites(coinSymbol) {
    console.log(`adding ${coinSymbol} to favorites`);
  }

  openNewsPage(coin) {
    // push another page onto the navigation stack
    this.navCtrl.push(NewsPage, {coin: coin});
  }

  openCoinOptions(coin) {
    let actionSheet = this.actionSheetCtrl.create({
      title: `${coin.name} options`,
      buttons: [
        {
          text: 'Add to Favorites',
          icon: 'star',
          role: 'destructive',
          handler: () => this.addToFavorites(coin.symbol)
        },{
          text: 'Add to Portfolio',
          icon: 'pie',
          handler: () => console.log('Pie clicked')
        },{
          text: 'See News',
          icon: 'paper',
          handler: () => this.openNewsPage(coin)
        },{
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => console.log('Cancel clicked')
        }
      ]
    });
    actionSheet.present();
  }
}
