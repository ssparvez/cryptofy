import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { ToastController } from 'ionic-angular';
import { User } from '../models/user';

@Injectable()
export class AuthService {
  user: Observable <User> ;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, public toastCtrl: ToastController) {
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.switchMap(user => {
      if(user) return this.db.doc<User>(`users/${user.uid}`).valueChanges()
      else return Observable.of(null);
    })
  }

  signIn(social: string) {
    const provider = {
      'google': new firebase.auth.GoogleAuthProvider(),
      'facebook': new firebase.auth.FacebookAuthProvider(),
      'twitter': new firebase.auth.TwitterAuthProvider()
    }
    return this.oAuthLogin(provider[social]);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
        const toast = this.toastCtrl.create({
          message: 'Successfully signed in :)',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
      .catch((error) => {
        const toast = this.toastCtrl.create({
          message: 'Unsuccessful sign in :(',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    return userRef.set(data, {merge: true});
  }
  
  signOut() {
    this.afAuth.auth.signOut();
    const toast = this.toastCtrl.create({
        message: 'Successfully signed out',
        duration: 3000,
        position: 'top'
    });
    toast.present();
  }
}
