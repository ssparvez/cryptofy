import { Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { NewsPage } from '../news/news';
import { Storage } from '@ionic/storage';
import { SettingsProvider } from '../../providers/settings-provider';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  coins: any;
  currency: String = "USD";
  showSpinner: boolean = true;
  searchInput: string = "";

  constructor(public navCtrl: NavController, private dataProvider: DataProvider, public storage: Storage, public toastCtrl: ToastController, 
    public actionSheetCtrl: ActionSheetController, private settingsProvider: SettingsProvider) {
  }
  
  ionViewWillEnter() { // on page load
     // load coin market cap data
     this.dataProvider.getCoinList().subscribe(data => {
      this.showSpinner = false;
      console.log(data);
      this.coins = data;
      // load the currency preference
      this.settingsProvider.getActiveCurrency().subscribe(val => this.currency = val);
    });
  }

  // on page refresh
  refreshCoinList(refresher) {
    this.dataProvider.getCoinList().subscribe(
      data => this.coins = data,
      error => {
        refresher.complete();
        const toast = this.toastCtrl.create({
          message: "Can't retrieve data",
          duration: 1000,
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

  upperBound: number = 20;
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.upperBound += 20;
      infiniteScroll.complete();
    }, 500);
  }
}
