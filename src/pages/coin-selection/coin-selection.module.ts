import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoinSelectionPage } from './coin-selection';

@NgModule({
  declarations: [
    CoinSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinSelectionPage),
  ],
})
export class WalletsPageModule {}
