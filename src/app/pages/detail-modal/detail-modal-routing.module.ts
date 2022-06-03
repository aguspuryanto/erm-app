import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailModalPage } from './detail-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetailModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailModalPageRoutingModule {}
