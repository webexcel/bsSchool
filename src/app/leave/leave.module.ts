import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { TranModule } from '../tran.module';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveComponent } from './leave.component';

@NgModule({
  declarations: [LeaveComponent],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    IonicModule,
    FormsModule,
    TranModule,
    PinchZoomModule,
  ],
})
export class LeaveModule {}
