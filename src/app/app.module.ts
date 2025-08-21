import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranModule } from './tran.module';
//service
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { JwtInterceptor } from './service/jwt.interceptor';
import { LoadingService } from './service/loading.service';

import { MatDividerModule } from '@angular/material/divider';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Base64 } from '@ionic-native/base64/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Media } from '@ionic-native/media/ngx';
import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { NgCalendarModule } from 'ionic7-calendar';
import { NgxEventCalendarModule } from 'src/projects/ngx-event-calendar/src/public-api';
import { CalenderComponent } from './calender/calender.component';
import { NgInitDirective } from './circulars/nginit.directive';
import { AudioProcessingService } from './service/audio-processing-service';
import { VideoProcessingService } from './service/video-processing-service';
import { YtProvider } from './service/ytservice';

@NgModule({
  declarations: [AppComponent, CalenderComponent, NgInitDirective],
  // , PdfPipe
  // entryComponents: [ ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    ModalModule.forRoot(),
    TranModule,
    NgxEventCalendarModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    NgxUiLoaderModule,
    IonicModule.forRoot(),
    PinchZoomModule,
    NgCalendarModule,
  ],
  exports: [
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatNativeDateModule,
    NgxEventCalendarModule,
    FlexLayoutModule,
  ],
  providers: [
    VideoPlayer,
    LoadingService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    StatusBar,
    SplashScreen,
    AppMinimize,
    Badge,
    InAppBrowser,
    Market,
    NativeAudio,
    File,
    FileOpener,
    YoutubeVideoPlayer,
    YtProvider,
    Base64,
    AudioProcessingService,
    VideoProcessingService,
    Media,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
