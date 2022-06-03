import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailCommentPage } from './detail-comment.page';

const routes: Routes = [
  {
    path: '',
    component: DetailCommentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailCommentPageRoutingModule {}
