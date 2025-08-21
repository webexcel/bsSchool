import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalenderModPageRoutingModule } from './calender-mod-routing.module';

import localeDe from '@angular/common/locales/en';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgCalendarModule } from 'ionic7-calendar';
import { CalenderModPage } from './calender-mod.page';
registerLocaleData(localeDe);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalenderModPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [CalenderModPage],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-EN' }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalenderModPageModule {}
