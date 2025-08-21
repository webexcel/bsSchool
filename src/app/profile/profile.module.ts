import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    IonicModule,
    TranModule,
    SegmentModule,
    FormsModule,
    PinchZoomModule,
  ],
})
export class ProfileModule {}
