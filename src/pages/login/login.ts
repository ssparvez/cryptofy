import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { EmailLoginPage } from '../email-login/email-login';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, public auth: AuthService) {
  }

  async signInWith(social) {
    if(this.platform.is("cordova")) await this.auth.nativeSocialSignIn(social);
    else await this.auth.webSocialSignIn(social);
    this.navCtrl.popToRoot();
  }

  openEmailLoginPage() {
    this.navCtrl.push(EmailLoginPage);
  }
}
