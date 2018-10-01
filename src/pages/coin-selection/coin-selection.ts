import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HoldingInfoPage } from '../holding-info/holding-info';
import { DataProvider } from '../../providers/data-provider';

@Component({
  selector: 'page-coin-selection',
  templateUrl: 'coin-selection.html',
})
export class CoinSelectionPage {
  coins: any;
  coinSymbols: string[];
  showSpinner: boolean = true;
  searchInput: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
  }

  ionViewWillEnter() {
    this.coinSymbols = this.navParams.get('coinSymbols');
    console.log(this.coinSymbols);
    this.dataProvider.getCoinList().subscribe(data => {
      this.showSpinner = false;
      console.log(data);
      this.coins = data
      this.coins = this.coins.filter(coin => this.coinSymbols.indexOf(coin.symbol) == -1)
    });
  }

  openWalletInfoPage(coin) { this.navCtrl.push(HoldingInfoPage, {coin, type: 'Add'}); }

  upperBound: number = 50;
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.upperBound += 50;
      infiniteScroll.complete();
    }, 200);
  }
}
