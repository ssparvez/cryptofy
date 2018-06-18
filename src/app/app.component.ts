import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsProvider } from '../providers/settings-provider';
import { PremiumProvider } from '../providers/premium-provider';
//import { AdMobFree, AdMobFreeBannerConfig} from '@ionic-native/admob-free';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  selectedTheme: String = "light-theme";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private settingsProvider: SettingsProvider, private premiumProvider: PremiumProvider
    /*private adMob: AdMobFree*/) {
    this.settingsProvider.getDarkMode().subscribe(val => this.selectedTheme = (val ? 'dark' : 'light') + '-theme');
    this.premiumProvider.configurePurchasing();
    //if(platform.is("cordova")) this.showBannerAd();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  // async showBannerAd() {
  //   const bannerConfig: AdMobFreeBannerConfig = {
  //     id: 'ca-app-pub-5196559267488563/6383526559',
  //     isTesting: true,
  //     autoShow: true
  //   }
  //   this.adMob.banner.config(bannerConfig);
  //   try {
  //     const result = this.adMob.banner.prepare();
  //     console.log(result);
  //   }
  //   catch(error) {
  //     console.log(error);
  //   }
  // }
}
