import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CryptodataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CryptodataProvider {
  //url = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,LTC&tsyms=USD";
  url = "https://api.coinmarketcap.com/v1/ticker/?limit=10";
  constructor(public http: HttpClient) {
    console.log('Hello CryptodataProvider Provider');
    

  }

  getCryptoData(coinType: String) {
    return this.http.get(this.url);
  }

}
