import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { TimetableRoutingModule } from './timetable-routing.module';
import { TimetableComponent } from './timetable.component';

@NgModule({
  declarations: [TimetableComponent],
  imports: [
    CommonModule,
    TimetableRoutingModule,
    IonicModule,
    FormsModule,
    TranModule,
    PinchZoomModule,
    SegmentModule,
  ],
})
export class TimetableModule {}
