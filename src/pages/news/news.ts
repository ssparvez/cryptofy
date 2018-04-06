import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  coin: any;
  articles = [];
  
  constructor(public navCtrl: NavController, private dataProvider: DataProvider, private navParams: NavParams, private iab: InAppBrowser) {
    this.coin = this.navParams.get('coin');
    console.log(this.coin.name);
  }

  // on page load
  ionViewWillEnter() {
    this.dataProvider.getCoinNews(this.coin).subscribe(data => {
      this.articles = data['articles'];
      console.log(data);
    });
  }

  openBrowser(articleUrl) {
    this.iab.create(articleUrl);
  }

}
