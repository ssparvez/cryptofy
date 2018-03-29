import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallet-info',
  templateUrl: 'wallet-info.html',
})
export class WalletInfoPage {
  coin: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.coin = this.navParams.get('coin');
    console.log(this.coin.name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletInfoPage');
  }

  closeModal() {
    this.navCtrl.popToRoot();
  }

}
