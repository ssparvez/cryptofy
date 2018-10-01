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
    this.premiumProvider.getPremium().subscribe(isPremium => {
      if(isPremium) {
        this.navCtrl.popToRoot();
        this.navCtrl.parent.select(1);
      }
    })
  }

  async purchase() { await this.premiumProvider.purchase(); }

  ionViewWillLeave() { this.navCtrl.popToRoot(); }
}
