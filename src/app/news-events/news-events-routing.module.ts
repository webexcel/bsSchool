import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import {NewsEventsComponent} from './news-events.component';

const routes: Routes = [
  {
    path: '',
    component: NewsEventsComponent
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NewsEventsRoutingModule {}
