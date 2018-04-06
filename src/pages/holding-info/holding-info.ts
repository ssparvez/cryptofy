import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Holding } from '../../models/holding';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-holding-info',
  templateUrl: 'holding-info.html',
})
export class HoldingInfoPage {
  coin: any;
  coinAmount: number;
  formType: string;
  userId: string;
  holdingId: string;
  private holdingForm : FormGroup;

  holdingCollection: AngularFirestoreCollection<Holding>;
  holdings: Observable<Holding[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, private formBuilder: FormBuilder, public db: AngularFirestore, public toastCtrl: ToastController) {
    this.coin = this.navParams.get('coin');
    this.coinAmount = this.navParams.get('amount');
    this.formType = this.navParams.get('type');
    this.holdingId = this.navParams.get('holdingId');
    console.log(this.coin.name);
    console.log(`coin amt: ${this.coinAmount}`);
    
    // create form builder
    this.holdingForm = this.formBuilder.group({ 
      amount: [this.coinAmount ? this.coinAmount: '', Validators.required] 
    });

    auth.user.subscribe(user => {
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

  submitHolding() {
    if(this.formType == 'Add') {
      console.log('adding coin');
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
    }
    else {
      console.log(`Editing ${this.coin.name}`);
      this.db.doc(`holdings/${this.holdingId}`).update({amount: parseFloat(this.holdingForm.value.amount)})
    }
    this.navCtrl.popToRoot();
  }
}
