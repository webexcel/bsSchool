import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/en';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { NgCalendarModule } from 'ionic7-calendar';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
registerLocaleData(localeDe);

@NgModule({
  declarations: [AttendanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    PinchZoomModule,
    NgCalendarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-EN' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AttendanceModule {}
