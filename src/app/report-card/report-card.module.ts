import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { ReportCardRoutingModule } from './report-card-routing.module';
import { ReportCardComponent } from './report-card.component';
// import { ChartsModule } from 'ng2-charts-x';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [ReportCardComponent],
  imports: [
    CommonModule,
    ReportCardRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    NgChartsModule,
    PinchZoomModule,

    // ChartsModule
  ],
})
export class ReportCardModule {}
