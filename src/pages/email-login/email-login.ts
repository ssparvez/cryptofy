import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'page-email-login',
  templateUrl: 'email-login.html',
})
export class EmailLoginPage {
  private emailForm : FormGroup;

  constructor(public navCtrl: NavController, public auth: AuthService, private formBuilder: FormBuilder) {
    // create form builder
    this.emailForm = this.formBuilder.group({ 
      createOrLogIn: ['logIn', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  closeModal() {
    this.navCtrl.popToRoot();
  }

  async submitCredentials() {
    const credentials = {email: this.emailForm.value.email, password: this.emailForm.value.password}
    if(this.emailForm.value.createOrLogIn == "logIn") await this.auth.signInWithEmail(credentials)
    else await this.auth.createAccountWithEmail(credentials)
    this.navCtrl.popToRoot();
  }
}
