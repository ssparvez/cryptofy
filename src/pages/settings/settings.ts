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
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, public storage: Storage, public alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.storage.ready().then(()=> {
      this.storage.get('darkMode').then((val) => {
        console.log('Your age is', val);
        this.settings.darkMode = val;
      });
      this.storage.get('currency').then((val) => {
        console.log('Your age is', val);
        this.settings.currency = val;
      });
    });
  }

  setDarkMode() {
    this.storage.set('darkMode', !this.settings.darkMode);
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
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  removeAccount() {

  }
}
