import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  selectedTheme: string = "light-theme";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.storage.ready().then(() => {
        this.storage.get('darkMode').then(darkMode => {
          console.log('Your theme is', darkMode);
          // problem when storage value not set
          if(darkMode !== null && darkMode !== undefined && darkMode.length !== 0) {
            this.selectedTheme = darkMode? 'dark-theme' : 'light-theme'; 
          }
        })
      });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
