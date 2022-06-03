import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/login',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    // canLoad: [AuthGuard], // Secure all child pages
    canActivate: [AuthGuard],
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard] // Check if we should show the introduction or forward to inside
  },
  {
    path: 'detail-all',
    loadChildren: () => import('./pages/detail-all/detail-all.module').then( m => m.DetailAllPageModule)
  },
  {
    path: 'detail-modal',
    loadChildren: () => import('./pages/detail-modal/detail-modal.module').then( m => m.DetailModalPageModule)
  },
  {
    path: 'detail-comment',
    loadChildren: () => import('./pages/detail-comment/detail-comment.module').then( m => m.DetailCommentPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
