import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../core/auth.service';
import { WalletsPage } from '../wallets/wallets';


@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  constructor(public navCtrl: NavController, db: AngularFirestore, public auth: AuthService) {
    console.log(auth.user);
    this.itemsCollection = db.collection('items');
    this.items = this.itemsCollection.valueChanges();
    console.log(this.items);
  }

  displayWallets() {
    let modal = this.navCtrl.push(WalletsPage);
  }
}

interface Item {
  id?: string,
  title?: string,
  description?: string
}


