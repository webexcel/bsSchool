import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalenderModPage } from './calender-mod.page';

const routes: Routes = [
  {
    path: '',
    component: CalenderModPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalenderModPageRoutingModule {}
