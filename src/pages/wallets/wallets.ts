import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WalletInfoPage } from '../wallet-info/wallet-info';
import { CryptoProvider } from '../../providers/cryptodata';

@IonicPage()
@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {
  coins: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: CryptoProvider) {
  }

  ionViewWillEnter() {
    this.dataProvider.getCoinList().subscribe(data => {
      console.log(data);
      this.coins = data
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletsPage');
  }

  openWalletInfoPage(coin) {
    this.navCtrl.push(WalletInfoPage, {coin});
  }
}
