import { Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
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

  constructor(public navCtrl: NavController, private dataProvider: DataProvider, public storage: Storage, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {
  }
  
  ionViewWillEnter() { // on page load
     // load coin market cap data
     this.dataProvider.getCoinList().subscribe(data => {
      this.showSpinner = false;
      console.log(data);
      this.coins = data;
      // load the currency preference
      this.storage.ready().then(() => {
        this.storage.get('currency').then(currency => {
          console.log('Your curr is', currency);
          // problem when storage value not set
          if(currency !== null && currency !== undefined && currency.length !== 0) {
            this.currency = currency; 
          }
        })
      });
    });
  }

  // on page refresh
  refreshCoinList(refresher) {
    this.dataProvider.getCoinList().subscribe(
      data => this.coins = data,
      error => {
        refresher.complete();
        let toast = this.toastCtrl.create({
          message: "Can't retrieve data",
          duration: 3000,
          position: "top"
        });
        toast.present();
      },
      () => refresher.complete()
    );
  }

  addToFavorites(coinSymbol) {
    console.log(`adding ${coinSymbol} to favorites`);
  }

  openNewsPage(coin) { // push another page onto the navigation stack
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
