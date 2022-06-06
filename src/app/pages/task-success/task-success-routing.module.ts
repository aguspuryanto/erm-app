import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskSuccessPage } from './task-success.page';

const routes: Routes = [
  {
    path: '',
    component: TaskSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskSuccessPageRoutingModule {}
