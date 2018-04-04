import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HoldingInfoPage } from './holding-info';

@NgModule({
  declarations: [
    HoldingInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(HoldingInfoPage),
  ],
})
export class WalletInfoPageModule {}
