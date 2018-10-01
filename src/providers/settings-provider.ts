import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
 
@Injectable()
export class SettingsProvider {

    settings: {
        darkMode: BehaviorSubject<Boolean>,
        currency: BehaviorSubject<String>,
        fingerprint: BehaviorSubject<Boolean>
        //notifications: true,
    }
 
    constructor(public storage: Storage) {
        this.settings = {
            darkMode: new BehaviorSubject(false),
            currency: new BehaviorSubject('USD'),
            fingerprint: new BehaviorSubject(false)
        }
        this.storage.ready().then(() => {
            for(let key in this.settings) {
                this.storage.get(key).then(setting => {
                    console.log(`Your ${key} is ${setting}`);
                    if(setting && setting.length !== 0) {
                        this.settings[key].next(setting);
                    }
                });
            }
        });
    }

    setDarkMode(val) { this.settings.darkMode.next(val); }
    getDarkMode() { return this.settings.darkMode.asObservable(); }

    setCurrency(val) { this.settings.currency.next(val); }
    getCurrency() { return this.settings.currency.asObservable(); }

    setFingerprint(val) { this.settings.fingerprint.next(val); }
    getFingerprint() { return this.settings.fingerprint.asObservable(); }
}