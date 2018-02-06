import { Component } from '@angular/core';

import { PortfolioPage } from '../portfolio/portfolio';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PortfolioPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
