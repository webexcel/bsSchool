import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SegmentModule } from '../segment/segment.module';
import { TranModule } from '../tran.module';
import { UploadVideosRoutingModule } from './upload-videos-routing.module';
import { UploadVideosComponent } from './upload-videos.component';

@NgModule({
  declarations: [UploadVideosComponent],
  imports: [
    CommonModule,
    UploadVideosRoutingModule,
    IonicModule,
    FormsModule,
    TranModule,
    SegmentModule,
  ],
  // exports: [UploadVideosComponent],
})
export class UploadVideosModule {}
