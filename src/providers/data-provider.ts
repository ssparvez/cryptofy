import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CryptodataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  //url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,LTC&tsyms=USD";
  dataUrl = "https://api.coinmarketcap.com/v1/ticker/?limit=100";
  newsUrl = 'https://newsapi.org/v2';
  constructor(public http: HttpClient) {
  }

  getPortfolioCoins(coinSymbols) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinSymbols}&tsyms=USD`;
    console.log("coin symbol url" + url);
    return this.http.get(url);
  }

  getCoinList() {
    return this.http.get(this.dataUrl);
  }
  getCoinNews(coin: any) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 5);
    console.log(currentDate);
    console.log(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + (currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()));
    return this.http.get(this.newsUrl + '/everything?' +
          'q=' + '\+' + coin.id + ' OR ' + coin.symbol + '&' +
          'from=' + currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + (currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()) + '&' +
          'sortBy=popularity&' +
          'language=en&' +
          'apiKey=7c15a387033f4c7e873d2f7abda84009');
  }

}
