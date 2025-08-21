import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { McqPage } from './mcq.page';

const routes: Routes = [
  {
    path: '',
    component: McqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class McqPageRoutingModule {}
