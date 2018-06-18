import { Injectable } from '@angular/core';
import { productId } from '../environment';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';
import { BehaviorSubject } from 'rxjs';
import { ToastController } from 'ionic-angular';

@Injectable()
export class PremiumProvider {

  private isPremium: BehaviorSubject<Boolean>;

  constructor(private store: InAppPurchase2, private toastCtrl: ToastController) {
    this.isPremium = new BehaviorSubject(false);
  }

  setPremium(val) { this.isPremium.next(val); }
  getPremium() { return this.isPremium.asObservable(); }

  configurePurchasing() {
    try {
      // Register Product
      this.store.register({
        id: productId,
        alias: productId,
        type: this.store.NON_CONSUMABLE
      });
      console.log(this.store.get(productId));
      this.createHandlers();
      this.store.ready().then((status) => {
        console.log(JSON.stringify(this.store.get(productId)));
        console.log('Store is Ready: ' + JSON.stringify(status));
        console.log('Products: ' + JSON.stringify(this.store.products));
      });
      // Refresh Always
      console.log('Refresh Store');
      this.store.refresh();
    } catch (err) {
      console.log('Error On Store Issues' + JSON.stringify(err));
    }
  }

  createHandlers() {
    this.store.when(productId).approved((product: IAPProduct) => {
      product.finish();
    });
    this.store.when(productId).updated((product: IAPProduct) => {
      console.log('Loaded' + JSON.stringify(product));
    });
    this.store.when(productId).owned((product: IAPProduct) => {
      console.log('Owned' + JSON.stringify(product));
    });
    this.store.when(productId).cancelled((product) => {
      console.log('Purchase was Cancelled');
    });
    this.store.when(productId).error((error) => {
      // Errors On The Specific Product
      console.log('An Error Occured' + JSON.stringify(error));
    });
    // Overall Store Error
    this.store.error((err) => {
      console.log('Store Error ' + JSON.stringify(err));
    });
  }

  async purchase() {
    /* Only configuring purchase when you want to buy, because when you configure a purchase
    It prompts the user to input their apple id info on config which is annoying */
    console.log('Ordering From Store: ' + productId);
    try {
      let product = this.store.get(productId);
      console.log('Product Info: ' + JSON.stringify(product));
      let order = await this.store.order(productId);
      console.log('Finished Purchase' + JSON.stringify(order));
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }
}
