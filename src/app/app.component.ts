import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsProvider } from '../providers/settings-provider';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  selectedTheme: String = "light-theme";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private settingsProvider: SettingsProvider) {
    this.settingsProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
