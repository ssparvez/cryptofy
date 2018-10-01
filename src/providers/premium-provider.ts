import { Injectable } from '@angular/core';
import { productId } from '../environment';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { BehaviorSubject } from 'rxjs';
import { ToastController, Toast } from 'ionic-angular';

@Injectable()
export class PremiumProvider {
  toast: Toast;
  private isPremium: BehaviorSubject<Boolean>;

  constructor(private store: InAppPurchase2, private toastCtrl: ToastController) {
    this.toast = this.toastCtrl.create({duration: 3000, position: 'top'});
    this.isPremium = new BehaviorSubject(false);
  }

  setPremium(val) { this.isPremium.next(val); }
  getPremium() { return this.isPremium.asObservable(); }

  configurePurchasing() {
    console.log("hello")
    try {
      //this.store.verbosity = this.store.DEBUG; // for debugging, this causes handlers to not work?
      // Register Product
      this.store.register({
        id: productId,
        alias: productId,
        type: this.store.NON_CONSUMABLE
      });
      //console.log(this.store.get(productId));
      this.createHandlers();
      this.store.ready().then((status) => {
        console.log(JSON.stringify(this.store.get(productId)));
        console.log('Store is Ready: ' + JSON.stringify(status, null, 4));
        console.log('Products: ' + JSON.stringify(this.store.products));
      });
      // Refresh Always
      console.log('Refresh Store');
      this.store.refresh();
    } catch (err) { console.log('Error On Store Issues' + JSON.stringify(err)); }
  }

  createHandlers() {
    this.store.when(productId).approved((product: IAPProduct) => {
      console.log("APPROVED" + JSON.stringify(product, null, 4));
      product.finish();
      this.setPremium(true);
    });
    this.store.when(productId).owned((product: IAPProduct) => {
      console.log('OWNED' + JSON.stringify(product, null, 4));
      this.setPremium(true);
    });
    this.store.when(productId).cancelled((product) => {
      console.log('Purchase was Cancelled');
      this.toast.setMessage("Purchase was Cancelled");
      this.toast.present();
    });
    this.store.when(productId).error(err => console.log('Product Error' + JSON.stringify(err, null, 4)));
    this.store.error(err => console.log('Store Error ' + JSON.stringify(err, null, 4)));
  }

  async purchase() {
    /* Only configuring purchase when you want to buy, because when you configure a purchase
    It prompts the user to input their apple id info on config which is annoying */
    console.log('Ordering From Store: ' + productId);
    try {
      let product = this.store.get(productId);
      console.log('Product Info: ' + JSON.stringify(product, null, 4));
      let order = await this.store.order(productId);
      console.log('Finished Purchase' + JSON.stringify(order, null, 4));
    } catch (err) { console.log('Error Ordering ' + JSON.stringify(err, null, 4)); }
  }
}
