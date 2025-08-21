import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { ExamScheduleRoutingModule } from './exam-schedule-routing.module';
import { ExamScheduleComponent } from './exam-schedule.component';

@NgModule({
  declarations: [ExamScheduleComponent],
  imports: [
    CommonModule,
    ExamScheduleRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    PinchZoomModule,
  ],
})
export class ExamScheduleModule {}
