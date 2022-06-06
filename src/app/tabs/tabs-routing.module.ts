import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        // loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
        loadChildren: () => import('../pages/priority/priority.module').then(m => m.PriorityPageModule)
      },
      {
        path: 'tab3',
        // loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
        loadChildren: () => import('../pages/calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
