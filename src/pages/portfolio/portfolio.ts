import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  constructor(public navCtrl: NavController, db: AngularFirestore) {
    this.itemsCollection = db.collection('items');
    this.items = this.itemsCollection.valueChanges();
    console.log(this.items);
  }

}

interface Item {
  id?: string,
  title?: string,
  description?: string
}


