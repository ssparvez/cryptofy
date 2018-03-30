import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../core/auth.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Transaction } from '../../models/transaction';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-wallet-info',
  templateUrl: 'wallet-info.html',
})
export class WalletInfoPage {
  coin: any;
  userId: string;
  private transactionForm : FormGroup;

  transactionCollection: AngularFirestoreCollection<Transaction>;
  transactions: Observable<Transaction[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthService, private formBuilder: FormBuilder, afs: AngularFirestore) {
    this.coin = this.navParams.get('coin');
    console.log(this.coin.name);
    
    // create form builder
    this.transactionForm = this.formBuilder.group({
      type: ['', Validators.required],
      amount: ['', Validators.required],
      price: ['', Validators.required],
    });

    auth.user.subscribe((user)=> {
      console.log(user.uid);
      this.userId = user.uid;
      this.transactionCollection = afs.collection('transactions');
      this.transactions = this.transactionCollection.valueChanges();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletInfoPage');
  }

  closeModal() {
    this.navCtrl.popToRoot();
  }

  addTransaction() {
    console.log(this.transactionForm.value);
    const newTransaction: Transaction = {
      userId: this.userId,
      coinName: this.coin.name,
      coinSymbol: this.coin.symbol,
      amount: this.transactionForm.value.amount,
      price: this.transactionForm.value.price,
      type: this.transactionForm.value.type
    }
    this.transactionCollection.add(newTransaction);
    this.navCtrl.popToRoot();
  }
}
