import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskSuccessPageRoutingModule } from './task-success-routing.module';

import { TaskSuccessPage } from './task-success.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskSuccessPageRoutingModule
  ],
  declarations: [TaskSuccessPage]
})
export class TaskSuccessPageModule {}
