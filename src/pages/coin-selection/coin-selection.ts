import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HoldingInfoPage } from '../holding-info/holding-info';
import { DataProvider } from '../../providers/data-provider';

@IonicPage()
@Component({
  selector: 'page-coin-selection',
  templateUrl: 'coin-selection.html',
})
export class CoinSelectionPage {
  coins: any;
  coinSymbols: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
  }

  ionViewWillEnter() {
    this.coinSymbols = this.navParams.get('coinSymbols');
    console.log(this.coinSymbols);
    this.dataProvider.getCoinList().subscribe(data => {
      console.log(data);
      this.coins = data
      this.coins = this.coins.filter(coin => this.coinSymbols.indexOf(coin.symbol) == -1)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletsPage');
  }

  openWalletInfoPage(coin) {
    this.navCtrl.push(HoldingInfoPage, {coin, type: 'Add'});
  }
}
