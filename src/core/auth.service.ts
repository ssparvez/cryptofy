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
    this.toast = this.toastCtrl.create({duration: 1000, position: 'top'});
    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.switchMap(user => {
      if(user) return this.db.doc<User>(`users/${user.uid}`).valueChanges()
      else return Observable.of(null);
    });
  }

  createAccountWithEmail(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(credential => {
        console.log(credential);
        this.updateUserData(credential);
        this.toast.setMessage('Account made!');
        this.toast.present();
      })
      .catch(error => {
        console.log(error);
        this.toast.setMessage("Couldn't make account");
        this.toast.present();
      });
  }

  signInWithEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateUserData(credential);
        this.toast.setMessage('Hi!');
        this.toast.present();
      })
      .catch(error => {
        console.log(error);
        this.toast.setMessage('Invalid email or password');
        this.toast.present();
      }
    );
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
    return await this.afAuth.auth.signInWithCredential(credential)
      .then(credential => {
        console.log(credential);
        this.updateUserData(credential);
        this.toast.setMessage(`Hi!`);
        this.toast.present();
      })
      .catch(err => console.log(err));
  }

  webSocialSignIn(social: string) {
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
      }
    );
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
    if(this.platform.is("cordova")) {
      this.gplus.logout(); 
      this.facebook.logout();
      this.twitter.logout();
    }
    this.toast.setMessage('Bye!');
    this.toast.present();
  }
}
