import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Storage } from '@ionic/storage';
import { SettingsProvider } from '../../providers/settings-provider';
import { Market } from '@ionic-native/market';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LoginPage } from '../login/login';


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
  fingerprintAvailable = true;

  fingerprintOptions = {
    clientId: 'Fingerprint-Demo',
    clientSecret: 'password', //Only necessary for Android
    disableBackup: true //Only for Android(optional))
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, 
    public storage: Storage, private settingsProvider: SettingsProvider, private market: Market, private socialSharing: SocialSharing,
    private platform: Platform, private fingerprintAIO: FingerprintAIO, private iab: InAppBrowser) {
      if(this.platform.is("cordova")) this.checkFingerprint();
  }

  ionViewWillEnter() {
    this.auth.user.subscribe(user => {
      console.log(user);
      if(user) {
        if(user.photoURL) {
          if(user.photoURL.includes("google")) this.socialProvider = "Google";
          else if(user.photoURL.includes("twimg")) this.socialProvider = "Twitter";
          else if(user.photoURL.includes("facebook")) this.socialProvider = "Facebook";
        }
        else this.socialProvider = "email";
      }
    });
    this.storage.ready().then(()=> {
      for(let key in this.settings) {
        this.storage.get(key).then(setting => {
          console.log(`Your ${key} is ${setting}`);
          if(setting !== null && setting !== undefined && setting.length !== 0) {
            this.settings[key] = setting;
          }
        });
      }
    });
  }

  async checkFingerprint() {
    try {
      await this.platform.ready();
      this.fingerprintAvailable = await this.fingerprintAIO.isAvailable() == "OK";
      console.log("what up")
    }
    catch(e) { console.error(e); }
  }

  setDarkMode() {
    this.storage.set('darkMode', this.settings.darkMode);
    console.log(`dark mode set to ${this.settings.darkMode}`);
    this.settingsProvider.setActiveTheme(this.settings.darkMode ? "dark-theme" : 'light-theme');
  }
  setCurrency(value: any) {
    this.storage.set('currency', value);
    console.log(`currency mode set to ${this.settings.currency}`);
    this.settingsProvider.setActiveCurrency(this.settings.currency == 'USD' ? 'USD' : 'BTC');
  }

  setFingerprint() {
    this.settings.fingerprint = !this.settings.fingerprint; // prevent toggle
    this.fingerprintAIO.show(this.fingerprintOptions)
      .then((result) => {
        console.log(result);
        this.settings.fingerprint = !this.settings.fingerprint;
        this.storage.set('fingerprint', this.settings.fingerprint);
        this.settingsProvider.setFingerprint(this.settings.fingerprint);
        console.log(`fingerprint set to ${this.settings.fingerprint}`);
      })
      .catch(err => console.log(err));
  }

  openLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  rateApp() {
    this.market.open('com.ssparvez.cryptofy');
  }

  shareApp() {
    this.socialSharing.share("Download via: ", "Check out Cryptofy!", null, "www.google.com")
      .then(() => console.log('shared'));
  }

  openPrivacyPolicy() {
    this.iab.create("https://ssparvez.github.io/");
  }
}
