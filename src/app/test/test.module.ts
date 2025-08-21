import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { TranModule } from '../tran.module';
import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';

@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,
    TestRoutingModule,
    IonicModule,
    FormsModule,
    TranModule,
    IonicSelectableComponent,
  ],
})
export class TestModule {}
