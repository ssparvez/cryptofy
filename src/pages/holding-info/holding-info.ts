import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Holding } from '../../models/holding';
import { Observable } from 'rxjs/Observable';

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
    // create form builder
    this.holdingForm = this.formBuilder.group({ 
      amount: [this.coinAmount ? this.coinAmount : '', Validators.required] 
    });

    auth.user.subscribe(user => {
      console.log(user.uid);
      this.userId = user.uid;
      this.holdingCollection = db.collection('holdings');
      this.holdings = this.holdingCollection.valueChanges();
    });
  }

  closeModal() { this.navCtrl.popToRoot(); }

  submitHolding() {
    if(this.formType == 'Add') {
      console.log('adding coin');
      const newHolding: Holding = {
        userId: this.userId,
        coin: {
          name: this.coin.name,
          symbol: this.coin.symbol
        },
        amount: parseFloat(this.holdingForm.value.amount)
      }
      const toast = this.toastCtrl.create({duration: 1000, position: 'top'});
      this.holdingCollection.add(newHolding)
        .then(() => toast.setMessage(`Added ${newHolding.coin.name} holding`))
        .catch(() => toast.setMessage(`Couldn't add ${newHolding.coin.name} holding`));
      toast.present();
    }
    else {
      console.log(`Editing ${this.coin.name}`);
      this.db.doc(`holdings/${this.holdingId}`).update({amount: parseFloat(this.holdingForm.value.amount)})
    }
    this.navCtrl.popToRoot();
  }
}
