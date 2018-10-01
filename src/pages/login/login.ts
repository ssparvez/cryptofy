import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, Toast } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { EmailLoginPage } from '../email-login/email-login';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  toast: Toast;

  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, public auth: AuthService,
  private toastCtrl: ToastController) {
    this.toast = this.toastCtrl.create({duration: 3000, position: 'top'});
  }

  async signInWith(social) {
    try {
      let user;
      if(this.platform.is("cordova")) user = await this.auth.nativeSocialSignIn(social);
      else user = (await this.auth.webSocialSignIn(social)).user;
      
      console.log(user);
      this.auth.updateUserData(user);
      this.toast.setMessage(`Hi!`);
      this.navCtrl.popToRoot();
    }
    catch(error) { 
      console.log('login error:' + JSON.stringify(error, null, 4));
      this.toast.setMessage(error.message); 
    }
    finally { this.toast.present(); }
  }

  openEmailLoginPage() { this.navCtrl.push(EmailLoginPage); }
}
