import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PriorityPageRoutingModule } from './priority-routing.module';

import { PriorityPage } from './priority.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PriorityPageRoutingModule
  ],
  declarations: [PriorityPage]
})
export class PriorityPageModule {}
