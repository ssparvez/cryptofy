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

  createAccountWithEmail(email: string, password: string) {
    const toast = this.toastCtrl.create({duration: 1000, position: 'top'});
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(credential => {
        console.log('what up')
        console.log(credential);
        this.updateUserData(credential);
        toast.setMessage('Account created :)');
        toast.present();
      })
      .catch(error => {
        console.log(error);
        toast.setMessage('Unsuccessful account creation :(');
        toast.present();
      });
  }

  signInWithEmail(email: string, password: string) {
    const toast = this.toastCtrl.create({duration: 1000, position: 'top'});
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateUserData(credential);
        toast.setMessage('Successfully signed in :)');
        toast.present();
      })
      .catch(error => {
        toast.setMessage('Invalid email or password');
        toast.present();
      });
  }

  signInWithSocial(social: string) {
    const provider = {
      'google': new firebase.auth.GoogleAuthProvider(),
      'facebook': new firebase.auth.FacebookAuthProvider(),
      'twitter': new firebase.auth.TwitterAuthProvider()
    }
    const toast = this.toastCtrl.create({duration: 1000, position: 'top'});
    return this.afAuth.auth.signInWithRedirect(provider[social])
      .then(credential => {
        this.updateUserData(credential.user);
        toast.setMessage('Successfully signed in :)');
        toast.present();
      })
      .catch(error => {
        toast.setMessage('Unsuccessful sign in :(');
        toast.present();
      });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ? user.displayName : user.email,
      photoURL: user.photoURL,
    };
    return userRef.set(data, {merge: true});
  }
  
  signOut() {
    this.afAuth.auth.signOut();
    const toast = this.toastCtrl.create({
        message: 'Successfully signed out',
        duration: 1000,
        position: 'top'
    });
    toast.present();
  }
}
