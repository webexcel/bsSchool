import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LeaveLetterPage } from './leave-letter.page';

const routes: Routes = [
  {
    path: '',
    component: LeaveLetterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveLetterPageRoutingModule {}
