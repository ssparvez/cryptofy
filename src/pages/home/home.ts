import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CryptodataProvider } from '../../providers/cryptodata/cryptodata';
import { NewsPage } from '../news/news';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  coins: any;

  constructor(public navCtrl: NavController, private cryptodataProvider: CryptodataProvider) {

  }
  // on page load
  ionViewWillEnter() {
    this.cryptodataProvider.getCryptoData("jhgjh").subscribe(data => {
      console.log(data);
      this.coins = data
    });
  }

  // on page refresh
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.cryptodataProvider.getCryptoData("jhgjh").subscribe(data => {
      console.log(data);
      this.coins = data
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  pushPage(coin){
    // push another page onto the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    this.navCtrl.push(NewsPage, {
      coin: coin
    });
  }

}
