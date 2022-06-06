import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PriorityPage } from './priority.page';

const routes: Routes = [
  {
    path: '',
    component: PriorityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriorityPageRoutingModule {}
