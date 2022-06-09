import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassRecoveryPageRoutingModule } from './pass-recovery-routing.module';

import { PassRecoveryPage } from './pass-recovery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PassRecoveryPageRoutingModule
  ],
  declarations: [PassRecoveryPage]
})
export class PassRecoveryPageModule {}
