import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { TranModule } from '../tran.module';
import { CircularsRoutingModule } from './circulars-routing.module';
import { CircularsComponent } from './circulars.component';

@NgModule({
  declarations: [CircularsComponent],
  imports: [
    CommonModule,
    CircularsRoutingModule,
    IonicModule,
    TranModule,
    PinchZoomModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CircularsModule {}
