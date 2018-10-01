import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Storage } from '@ionic/storage';
import { SettingsProvider } from '../../providers/settings-provider';
import { Market } from '@ionic-native/market';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PremiumPage } from '../premium/premium';
import { PremiumProvider } from '../../providers/premium-provider';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  settings = {
    currency: "USD",
    darkMode: false,
    fingerprint: false,
    notifications: true,
  }
  socialProvider: string;
  hasFingerprint = true;

  fingerprintOptions = {
    clientId: 'Fingerprint-Demo',
    clientSecret: 'password', //Only necessary for Android
    disableBackup: true //Only for Android(optional))
  }
  isMobile = false;
  isPremium: Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, 
    public storage: Storage, private settingsProvider: SettingsProvider, private market: Market, private socialSharing: SocialSharing,
    private platform: Platform, private fingerprintAIO: FingerprintAIO, private inAppBrowser: InAppBrowser, private premiumProvider: PremiumProvider) {
    this.platform.ready().then(() => {
      if(this.platform.is("cordova")) {
        this.isMobile = true;
        this.checkFingerprint();
      }
    });
  }

  ionViewWillEnter() {
    this.auth.user.subscribe(user => {
      if(user) {
        if(user.photoURL) {
          if(user.photoURL.includes("google")) this.socialProvider = "Google";
          else if(user.photoURL.includes("twimg")) this.socialProvider = "Twitter";
          else if(user.photoURL.includes("facebook")) this.socialProvider = "Facebook";
        }
        else this.socialProvider = "email";
      }
    });
    this.premiumProvider.getPremium().subscribe(val => {
      this.isPremium = val
      console.log("is premium is: " + this.isPremium);
    });
    // not sure if this works, test later
    alert("check settings intializations yo");
    for(let key in this.settings) {
      this.settings[key] = this.settingsProvider.settings[key].value;
      // this.storage.get(key).then(setting => {
      //   if(setting !== null && setting !== undefined && setting.length !== 0) {
      //     this.settings[key] = setting;
      //   }
      // });
    }
  }

  async checkFingerprint() {
    try { this.hasFingerprint = await this.fingerprintAIO.isAvailable() == "OK"; }
    catch(e) { console.error(e); }
  }

  setDarkMode() {
    this.storage.set('darkMode', this.settings.darkMode);
    console.log(`dark mode set to ${this.settings.darkMode}`);
    this.settingsProvider.setDarkMode(this.settings.darkMode);
  }
  setCurrency() {
    this.storage.set('currency', this.settings.currency);
    console.log(`currency mode set to ${this.settings.currency}`);
    this.settingsProvider.setCurrency(this.settings.currency);
  }

  setFingerprint() {
    this.settings.fingerprint = !this.settings.fingerprint; // prevent toggle
    this.fingerprintAIO.show(this.fingerprintOptions)
      .then(result => {
        this.settings.fingerprint = !this.settings.fingerprint;
        this.storage.set('fingerprint', this.settings.fingerprint);
        this.settingsProvider.setFingerprint(this.settings.fingerprint);
        console.log(`fingerprint set to ${this.settings.fingerprint}`);
      })
      .catch(err => console.log(err));
  }

  switchToPortfolioPage() { this.navCtrl.parent.select(1) }
  openPremiumPage() { this.navCtrl.push(PremiumPage); }
  // app related stuff
  rateApp() { this.market.open('com.ssparvez.cryptofy'); }
  shareApp() { this.socialSharing.share(null, "Check out Cryptofy!", null, "https://ssparvez.github.io/cryptofy"); }
  openPrivacyPolicy() { this.inAppBrowser.create("https://ssparvez.github.io/cryptofy/privacy"); }
}
