import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

// pipes
import { FilterPipe} from '../pipes/filter.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';

// pages
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { NewsPage } from '../pages/news/news';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsPage } from '../pages/settings/settings';
import { CoinSelectionPage } from '../pages/coin-selection/coin-selection';
import { HoldingInfoPage } from '../pages/holding-info/holding-info';
import { EmailLoginPage } from '../pages/email-login/email-login';
import { LoginPage } from '../pages/login/login';
import { PremiumPage } from '../pages/premium/premium';

// custom providers
import { DataProvider } from '../providers/data-provider';
import { SettingsProvider } from '../providers/settings-provider';

// ionic native modules
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { AdMobFree } from '@ionic-native/admob-free'
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { Market } from '@ionic-native/market';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from '../environment';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PortfolioPage,
    NewsPage,
    SettingsPage,
    CoinSelectionPage,
    HoldingInfoPage,
    EmailLoginPage,
    LoginPage,
    PremiumPage,
    TabsPage,
    TimeAgoPipe,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    CoreModule,
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PortfolioPage,
    NewsPage,
    SettingsPage,
    TabsPage,
    CoinSelectionPage,
    HoldingInfoPage,
    EmailLoginPage,
    LoginPage,
    PremiumPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    SettingsProvider,
    InAppBrowser,
    GooglePlus,
    Facebook,
    TwitterConnect,
    //AdMobFree,
    Market,
    SocialSharing,
    FingerprintAIO,
    InAppPurchase2
  ]
})
export class AppModule {}
