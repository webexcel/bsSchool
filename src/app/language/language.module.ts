import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { TranModule } from '../tran.module';
import { LanguageRoutingModule } from './language-routing.module';
import { LanguageComponent } from './language.component';

@NgModule({
  declarations: [LanguageComponent],
  imports: [
    CommonModule,
    LanguageRoutingModule,
    IonicModule,
    FormsModule,
    TranModule,
    PinchZoomModule,
  ],
})
export class LanguageModule {}
