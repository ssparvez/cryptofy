import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletInfoPage } from './wallet-info';

@NgModule({
  declarations: [
    WalletInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletInfoPage),
  ],
})
export class WalletInfoPageModule {}
