import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeaveLetterPageRoutingModule } from './leave-letter-routing.module';

import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { LeaveLetterPage } from './leave-letter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeaveLetterPageRoutingModule,
    TranModule,
    SegmentModule
  ],
  declarations: [LeaveLetterPage]
})
export class LeaveLetterPageModule {}
