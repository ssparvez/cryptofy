import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CryptodataProvider } from '../../providers/cryptodata/cryptodata';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  coins: any;
  constructor(public navCtrl: NavController, private cryptodataProvider: CryptodataProvider) {
    
  }

  ionViewWillEnter() {
    this.cryptodataProvider.getCryptoData("jhgjh").subscribe(data => {
      console.log(data);
      this.coins = data
    });
  }

}
