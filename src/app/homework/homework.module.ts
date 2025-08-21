import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { HomeworkRoutingModule } from './homework-routing.module';
import { HomeworkComponent } from './homework.component';

@NgModule({
  declarations: [HomeworkComponent],
  imports: [
    CommonModule,
    HomeworkRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    AccordionModule.forRoot(),
    PinchZoomModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeworkModule {}
