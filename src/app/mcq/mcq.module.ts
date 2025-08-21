import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { McqPageRoutingModule } from './mcq-routing.module';

import { SegmentModule } from '../segment/segment.module';
import { McqPage } from './mcq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    McqPageRoutingModule,
    SegmentModule
  ],
  declarations: [McqPage]
})
export class McqPageModule {}
