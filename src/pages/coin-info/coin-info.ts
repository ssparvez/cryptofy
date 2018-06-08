import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import {  NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SettingsProvider } from '../../providers/settings-provider';

@Component({
  selector: 'page-coin-info',
  templateUrl: 'coin-info.html'
})
export class CoinInfoPage {
  coin: any;
  articles = [];

  chart = {
    type: 'line',
    labels: ['', '', '', '', '', '', ''],
    data: [{
      label: "Test",
      data: [1, 1, 1, 1, 1, 1, 1], // should cause 4 points in the chart
      fill: false,
      pointRadius: 0
    }],
    colors: [{
      borderColor: '#3D5AFE'
    }],
    options: {
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false
          }
        }],
        yAxes: [{
          gridLines: {
            drawBorder: false
          }
        }]
      }
    }
  }
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currency: String = "USD";
  constructor(public navCtrl: NavController, private dataProvider: DataProvider, private navParams: NavParams, private iab: InAppBrowser, private settingsProvider: SettingsProvider) {
    this.coin = this.navParams.get('coin');
    console.log(this.coin.name);
    console.log(this.coin);
  }

  // on page load
  ionViewWillEnter() {
    this.dataProvider.getCoinHistorical(this.coin.symbol).subscribe(data => {
      console.log(data);
      this.chart.data = data['Data'].map(a => a.close);
      console.log(this.chart.data)
    })
    this.dataProvider.getCoinNews(this.coin).subscribe(data => {
      this.articles = data['articles'];
      console.log(data);
    });
    this.settingsProvider.getCurrency().subscribe(val => this.currency = val);
  }

  openBrowser(articleUrl) {
    this.iab.create(articleUrl);
  }

}
