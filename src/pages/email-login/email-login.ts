import { Component } from '@angular/core';
import { NavController, Toast, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'page-email-login',
  templateUrl: 'email-login.html',
})
export class EmailLoginPage {
  private emailForm : FormGroup;
  toast: Toast;

  constructor(public navCtrl: NavController, public auth: AuthService, private formBuilder: FormBuilder, public toastCtrl: ToastController) {
    this.toast = this.toastCtrl.create({duration: 3000, position: 'top'});
    // create form builder
    this.emailForm = this.formBuilder.group({ 
      type: ['logIn', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  closeModal() { this.navCtrl.popToRoot(); }

  async submitCredentials() {
    const credentials = {email: this.emailForm.value.email, password: this.emailForm.value.password}
    try {
      let user;
      if(this.emailForm.value.type == "logIn") user = await this.auth.signInWithEmail(credentials)
      else user = await this.auth.createAccountWithEmail(credentials)
      
      this.auth.updateUserData(user);
      this.toast.setMessage(`Hi!`);
      this.navCtrl.popToRoot();
    }
    catch(error) { this.toast.setMessage(error.message); }
    finally { this.toast.present(); }
  }
}
