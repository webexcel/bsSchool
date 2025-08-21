import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { PdfPipe } from '../pipes/pdf.pipe';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { AnnualReportRoutingModule } from './annual-report-routing.module';
import { AnnualReportComponent } from './annual-report.component';

@NgModule({
  declarations: [AnnualReportComponent, PdfPipe],

  imports: [
    CommonModule,
    AnnualReportRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    PinchZoomModule,
  ],
})
export class AnnualReportModule {}
