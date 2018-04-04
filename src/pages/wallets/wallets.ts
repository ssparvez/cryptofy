import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HoldingInfoPage } from '../holding-info/holding-info';
import { CryptoProvider } from '../../providers/cryptodata';

@IonicPage()
@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {
  coins: any;
  coinSymbols: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: CryptoProvider) {
  }

  ionViewWillEnter() {
    this.coinSymbols = this.navParams.get('coinSymbols');
    this.dataProvider.getCoinList().subscribe(data => {
      console.log(data);
      this.coins = data
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletsPage');
  }

  openWalletInfoPage(coin) {
    this.navCtrl.push(HoldingInfoPage, {coin, type: 'Add'});
  }
}
