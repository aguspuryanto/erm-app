import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailAllPage } from './detail-all.page';

const routes: Routes = [
  {
    path: '',
    component: DetailAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailAllPageRoutingModule {}
