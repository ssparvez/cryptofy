import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Holding } from '../../models/holding';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-wallet-info',
  templateUrl: 'wallet-info.html',
})
export class WalletInfoPage {
  coin: any;
  userId: string;
  private holdingForm : FormGroup;

  holdingCollection: AngularFirestoreCollection<Holding>;
  holdings: Observable<Holding[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, private formBuilder: FormBuilder, db: AngularFirestore, public toastCtrl: ToastController) {
    this.coin = this.navParams.get('coin');
    console.log(this.coin.name);
    
    // create form builder
    this.holdingForm = this.formBuilder.group({ amount: ['', Validators.required] });

    auth.user.subscribe((user)=> {
      console.log(user.uid);
      this.userId = user.uid;
      this.holdingCollection = db.collection('holdings');
      this.holdings = this.holdingCollection.valueChanges();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletInfoPage');
  }

  closeModal() {
    this.navCtrl.popToRoot();
  }

  addHolding() {
    console.log(this.holdingForm.value);
    const newHolding: Holding = {
      userId: this.userId,
      coinName: this.coin.name,
      coinSymbol: this.coin.symbol,
      amount: parseFloat(this.holdingForm.value.amount),
    }
    this.holdingCollection.add(newHolding)
      .then(() => {
        const toast = this.toastCtrl.create({
          message: `Added ${newHolding.coinName} holding`,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
      .catch(() => {
        const toast = this.toastCtrl.create({
          message: `Couldn't add ${newHolding.coinName} holding`,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    this.navCtrl.popToRoot();
  }
}
