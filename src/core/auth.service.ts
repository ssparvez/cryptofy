import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { ToastController } from 'ionic-angular';

interface Wallet {
    coin: string;
    address: string;
}

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  wallets?: Wallet[];
}
@Injectable()
export class AuthService {
  user: Observable < User > ;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, public toastCtrl: ToastController) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc < User > (`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      })
  }
  signIn(social: string) {
    var provider;
    if(social == "google") {
        provider = new firebase.auth.GoogleAuthProvider();
    }
    else if(social == "facebook") {
        provider = new firebase.auth.FacebookAuthProvider();
    }
    else if(social == "twitter") {
        provider = new firebase.auth.TwitterAuthProvider();
    }
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithRedirect(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
        let toast = this.toastCtrl.create({
            message: 'Successfully signed in :)',
            duration: 3000,
            position: 'top'
          });
          toast.present();
      })
      .catch((error) => {
        let toast = this.toastCtrl.create({
            message: 'Unsuccessful sign in :(',
            duration: 3000,
            position: 'top'
          });
          toast.present();
      });
  }
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data)
  }
  signOut() {
    this.afAuth.auth.signOut();
    let toast = this.toastCtrl.create({
        message: 'Successfully signed out',
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }
}
