import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
 
@Injectable()
export class SettingsProvider {
 
    private theme: BehaviorSubject<String>;
    private currency: BehaviorSubject<String>;
    private fingerprint: BehaviorSubject<Boolean>;
 
    constructor(public storage: Storage) {
        this.theme = new BehaviorSubject('light-theme');
        this.currency = new BehaviorSubject('USD');
        this.fingerprint = new BehaviorSubject(false);
        this.storage.ready().then(() => {
            this.storage.get('darkMode').then(darkMode => {
                console.log('Your theme is', darkMode);
                if(darkMode !== null && darkMode !== undefined && darkMode.length !== 0) {
                    this.setTheme(darkMode? 'dark-theme' : 'light-theme'); 
                }
            });
            this.storage.get('currency').then(currency => {
                console.log('Your currency is', currency);
                if(currency !== null && currency !== undefined && currency.length !== 0) {
                    this.setCurrency(currency == 'USD'? 'USD' : 'BTC'); 
                }
            })
            this.storage.get('fingerprint').then(fingerprint => {
                console.log('Your fingerprint is', fingerprint);
                if(fingerprint !== null && fingerprint !== undefined && fingerprint.length !== 0) {
                    this.setFingerprint(fingerprint); 
                }
            })
        });
    }
 
    setTheme(val) {
        this.theme.next(val);
    }
 
    getTheme() {
        return this.theme.asObservable();
    }

    setCurrency(val) {
        this.currency.next(val);
    }

    getCurrency() {
        return this.currency.asObservable();
    }
    setFingerprint(val) {
        this.fingerprint.next(val);
    }

    getFingerprint() {
        return this.fingerprint.asObservable();
    }
}