import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  settings = {
    currency: "usd",
    darkMode: false,
    fingerprint: false,
    notifications: true,
  }

  socialProvider: string;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, 
    public storage: Storage, public alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.auth.user.subscribe((user) => {
      console.log(user);
      if(user) {
        if(user.photoURL.includes("google")) this.socialProvider = "Google";
        else if(user.photoURL.includes("twimg")) this.socialProvider = "Twitter";
        else if(user.photoURL.includes("facebook")) this.socialProvider = "Facebook";
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

  setDarkMode() {
    this.storage.set('darkMode', this.settings.darkMode);
    console.log(`dark mode set to ${this.settings.darkMode}`);
  }
  setCurrency(value: any) {
    this.storage.set('currency', value);
    console.log(`currency mode set to ${this.settings.currency}`);
  }

  switchToPortfolio() {
    this.navCtrl.parent.select(1);
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Remove Account?',
      message: 'All portfolio data will be destroyed and account will be unlinked.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => console.log('Disagree clicked')
        },
        {
          text: 'Ok',
          handler: () => this.removeAccount()
        }
      ]
    });
    confirm.present();
  }

  removeAccount() {
    console.log('Removing account...');
  }
}
