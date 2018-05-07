import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2';

@Component({
  selector: 'page-premium',
  templateUrl: 'premium.html',
})
export class PremiumPage {
  platformName: string;
  productId = "com.ssparvez.cryptofy.premium";


  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private store: InAppPurchase2) {
    this.platformName = (this.platform.is("ios") ? "iOS" : (this.platform.is("android") ? "Android" : null));
  }

  ionViewDidLoad() {
    this.configurePurchasing();
  }

  configurePurchasing() {
    try {
      // Register Product
      // Register the product with the store
      this.store.register({
        id: this.productId,
        alias: this.productId,
        type: this.store.NON_CONSUMABLE
      });

      this.createHandlers(this.productId);

      this.store.ready().then((status) => {
        console.log(JSON.stringify(this.store.get(this.productId)));
        console.log('Store is Ready: ' + JSON.stringify(status));
        console.log('Products: ' + JSON.stringify(this.store.products));
      });

      // Errors On The Specific Product
      this.store.when(this.productId).error( (error) => {
        console.log('An Error Occured' + JSON.stringify(error));
      });
      // Refresh Always
      console.log('Refresh Store');
      this.store.refresh();
    } catch (err) {
      console.log('Error On Store Issues' + JSON.stringify(err));
    }
  }

  createHandlers(productId) {
    // Handlers
    this.store.when(productId).approved((product: IAPProduct) => {
      // Purchase was approved
      product.finish();
    });

    this.store.when(productId).registered((product: IAPProduct) => {
      console.log('Registered: ' + JSON.stringify(product));
    });

    this.store.when(productId).updated((product: IAPProduct) => {
      console.log('Loaded' + JSON.stringify(product));
    });

    this.store.when(productId).cancelled((product) => {
      console.log('Purchase was Cancelled');
    });

    // Overall Store Error
    this.store.error((err) => {
      console.log('Store Error ' + JSON.stringify(err));
    });
  }

  async purchase() {
    /* Only configuring purchase when you want to buy, because when you configure a purchase
    It prompts the user to input their apple id info on config which is annoying */
    console.log('Products: ' + JSON.stringify(this.store.products));
    console.log('Ordering From Store: ' + this.productId);
    try {
      let product = this.store.get(this.productId);
      console.log('Product Info: ' + JSON.stringify(product));
      let order = await this.store.order(this.productId);
      console.log('Finished Purchase');
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }
}
