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

  submitCredentials() {
    if(this.emailForm.value.createOrLogIn == "logIn") {
      this.auth.signInWithEmail(this.emailForm.value.email, this.emailForm.value.password);
    }
    else {
      this.auth.createAccountWithEmail(this.emailForm.value.email, this.emailForm.value.password);
    }
    this.navCtrl.popToRoot();
  }
}
