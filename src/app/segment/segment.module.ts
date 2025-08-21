import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SegmentComponent } from './segment.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SegmentComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports:[
    CommonModule,
    IonicModule,
    FormsModule,
    SegmentComponent
  ]
})
export class SegmentModule { }
