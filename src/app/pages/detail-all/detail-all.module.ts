import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailAllPageRoutingModule } from './detail-all-routing.module';

import { DetailAllPage } from './detail-all.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailAllPageRoutingModule
  ],
  declarations: [DetailAllPage]
})
export class DetailAllPageModule {}
