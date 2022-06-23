import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiskUpdatePage } from './risk-update.page';

const routes: Routes = [
  {
    path: '',
    component: RiskUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiskUpdatePageRoutingModule {}
