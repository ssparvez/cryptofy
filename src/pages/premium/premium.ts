import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { PremiumProvider } from '../../providers/premium-provider';

@Component({
  selector: 'page-premium',
  templateUrl: 'premium.html',
})
export class PremiumPage {
  platformName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, public premiumProvider: PremiumProvider) {
    this.platformName = (this.platform.is("ios") ? "iOS" : (this.platform.is("android") ? "Android" : null));
  }

  async purchase() {
    await this.premiumProvider.purchase();
    //this.navCtrl.popToRoot();
  }
}
