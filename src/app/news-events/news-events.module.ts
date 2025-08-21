import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranModule } from '../tran.module';
import { NewsEventsRoutingModule } from './news-events-routing.module';
import { NewsEventsComponent } from './news-events.component';
// import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { NgInitDirective } from './nginit.directive';

@NgModule({
  declarations: [NewsEventsComponent, NgInitDirective],
  imports: [
    CommonModule,
    NewsEventsRoutingModule,
    IonicModule,
    TranModule,
    PinchZoomModule,

    // NgxExtendedPdfViewerModule
  ],
})
export class NewsEventsModule {}
