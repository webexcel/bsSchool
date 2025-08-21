import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { TranModule } from '../tran.module';
import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { SubgalleryComponent } from './subgallery/subgallery.component';
// import {Swiper} from 'swiper';

@NgModule({
  declarations: [GalleryComponent, SubgalleryComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    IonicModule,
    TranModule,
    PinchZoomModule,

    // SwiperModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GalleryModule {}
