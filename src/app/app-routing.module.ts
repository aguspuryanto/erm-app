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
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'detail/:cat/:id',
    loadChildren: () => import('./pages/detail/detail.module').then( m => m.DetailPageModule),
    // canLoad: [AuthGuard] // Secure all child pages
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'task-success',
    loadChildren: () => import('./pages/task-success/task-success.module').then( m => m.TaskSuccessPageModule)
  },
  {
    path: 'filter-search',
    loadChildren: () => import('./pages/filter-search/filter-search.module').then( m => m.FilterSearchPageModule)
  },
  {
    path: 'priority',
    loadChildren: () => import('./pages/priority/priority.module').then( m => m.PriorityPageModule)
  },
  {
    path: 'pass-recovery',
    loadChildren: () => import('./pages/pass-recovery/pass-recovery.module').then( m => m.PassRecoveryPageModule)
  },
  {
    path: 'new-task',
    loadChildren: () => import('./pages/new-task/new-task.module').then( m => m.NewTaskPageModule)
  },
  {
    path: 'category-modal',
    loadChildren: () => import('./pages/category-modal/category-modal.module').then( m => m.CategoryModalPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/success/success.module').then( m => m.SuccessPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
