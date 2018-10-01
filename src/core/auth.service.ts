import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ToastController, Toast } from 'ionic-angular';
import { User } from '../models/user';
import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { webClientId } from '../environment';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';

@Injectable()
export class AuthService {
  user: Observable<User>;
  toast: Toast;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, public toastCtrl: ToastController, private platform: Platform, private gplus: GooglePlus, private facebook: Facebook, private twitter: TwitterConnect) {
    this.toast = this.toastCtrl.create({duration: 3000, position: 'top'});
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.switchMap(user => {
      if(user) return this.db.doc<User>(`users/${user.uid}`).valueChanges()
      else return Observable.of(null);
    });
  }

  async createAccountWithEmail(credentials) {
    return await this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  async signInWithEmail(credentials) {
    return await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  async nativeSocialSignIn(social) {
    let user, credential;
    if(social == 'google') {
      user = await this.gplus.login({'webClientId': webClientId, 'offline': true, 'scopes': 'profile email'})
      credential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
    }
    else if(social == 'facebook') {
      user = await this.facebook.login(['public_profile', 'email']);
      credential = firebase.auth.FacebookAuthProvider.credential(user.authResponse.accessToken);
    }
    else { // twitter
      user = await this.twitter.login();
      credential = firebase.auth.TwitterAuthProvider.credential(user.token, user.secret);
    }
    console.log(user);
    return await this.afAuth.auth.signInWithCredential(credential);
  }

  async webSocialSignIn(social: string) {
    const provider = {
      'google': new firebase.auth.GoogleAuthProvider(),
      'facebook': new firebase.auth.FacebookAuthProvider(),
      'twitter': new firebase.auth.TwitterAuthProvider()
    }
    return await this.afAuth.auth.signInWithRedirect(provider[social]);
  }

  // linkSocialSignIn(credential) {
  //   this.afAuth.auth.onAuthStateChanged(user => {
  //     if (user) {
  //       return this.afAuth.auth.currentUser.linkWithCredential(credential)
  //         .then(val => console.log(val))
  //         .catch(err => console.log(err));
  //     } 
  //   });
  // }

  updateUserData(user) {
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

  isSignedIn() { return this.afAuth.auth.currentUser != null }
  
  signOut() {
    this.afAuth.auth.signOut();
    if(this.platform.is("cordova")) {
      this.gplus.logout(); 
      this.facebook.logout();
      this.twitter.logout();
    }
    this.toast.setMessage('Bye!');
    this.toast.present();
  }
}
