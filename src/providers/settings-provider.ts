import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
 
@Injectable()
export class SettingsProvider {
 
    private theme: BehaviorSubject<String>;
 
    constructor(public storage: Storage) {
        this.theme = new BehaviorSubject('light-theme');
        this.storage.ready().then(() => {
            this.storage.get('darkMode').then(darkMode => {
              console.log('Your theme is', darkMode);
              // problem when storage value not set
              if(darkMode !== null && darkMode !== undefined && darkMode.length !== 0) {
                this.theme.next(darkMode? 'dark-theme' : 'light-theme'); 
              }
            })
          });
    }
 
    setActiveTheme(val) {
        this.theme.next(val);
    }
 
    getActiveTheme() {
        return this.theme.asObservable();
    }
}