import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiskUpdatePageRoutingModule } from './risk-update-routing.module';

import { RiskUpdatePage } from './risk-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiskUpdatePageRoutingModule
  ],
  declarations: [RiskUpdatePage]
})
export class RiskUpdatePageModule {}
