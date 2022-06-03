import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailModalPageRoutingModule } from './detail-modal-routing.module';

import { DetailModalPage } from './detail-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailModalPageRoutingModule
  ],
  declarations: [DetailModalPage]
})
export class DetailModalPageModule {}
