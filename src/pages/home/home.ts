import { Component } from '@angular/core';
import { NavController, ToastController, ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { CoinInfoPage } from '../coin-info/coin-info';
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
  listFilter: string = "All";
  listLayout: string = "Comfortable";
  favorites: string[] = [];

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
      this.settingsProvider.getCurrency().subscribe(val => this.currency = val);
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

  getFavorites() {
    this.storage.get("favorites").then(favorites => {
      console.log(`Your favorites are ${favorites}`);
      if(favorites && favorites.length !== 0) {
          this.favorites = favorites;
      }
  });
  }

  openCoinInfoPage(coin) { // push another page onto the navigation stack
    this.navCtrl.push(CoinInfoPage, {coin: coin});
  }

  openFilterOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: `List filter options`,
      buttons: [
        {
          text: 'All',
          icon: 'list',
          handler: () => { this.listFilter = "All" }
        },{
          text: 'Portfolio',
          icon: 'pie',
          handler: () => { this.listFilter = "Portfolio" }
        },{
          text: 'Favorites',
          icon: 'star',
          handler: () => { this.getFavorites(); this.listFilter = "Favorites" }
        }
      ]
    });
    actionSheet.present();
  }

  openLayoutOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: `List layout options`,
      buttons: [
        {
          text: 'Comfortable',
          icon: 'list',
          handler: () => { this.listLayout = "Comfortable" }
        },{
          text: 'Compact',
          icon: 'pie',
          handler: () => { this.listLayout = "Compact" }
        }
      ]
    });
    actionSheet.present();
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
          handler: () => this.openCoinInfoPage(coin)
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
