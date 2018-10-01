import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsProvider } from '../providers/settings-provider';
import { PremiumProvider } from '../providers/premium-provider';
//import { AdMobFree, AdMobFreeBannerConfig} from '@ionic-native/admob-free';
//import { bannerId } from '../environment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  selectedTheme: String = "light-theme";

  constructor(
    platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private settingsProvider: SettingsProvider, 
    private premiumProvider: PremiumProvider, /*private adMob: AdMobFree */) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      //statusBar.styleDefault();
      splashScreen.hide();
      this.settingsProvider.getDarkMode().subscribe(val => this.selectedTheme = (val ? 'dark' : 'light') + '-theme');
      this.premiumProvider.configurePurchasing();
      //this.showBannerAd();
    });
  }
  /*
  showBannerAd() {
    console.log("yo")
    const bannerConfig: AdMobFreeBannerConfig = {
      id: bannerId,
      autoShow: false,
    }
    this.adMob.banner.config(bannerConfig);
    this.adMob.banner.prepare()
      .then(() => {
        console.log("ad success")
        this.premiumProvider.getPremium().subscribe(val => {
          if(val) this.adMob.banner.hide();
          else this.adMob.banner.show();
        })
      })
      .catch(e => console.log(e));
  }
  */
}
