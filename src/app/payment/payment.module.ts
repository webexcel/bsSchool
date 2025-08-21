import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material.module';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';

@NgModule({
  declarations: [PaymentComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    MaterialModule,
  ],
  exports: [MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentModule {}
