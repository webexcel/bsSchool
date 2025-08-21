import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import {GalleryComponent} from './gallery.component';
import {SubgalleryComponent} from './subgallery/subgallery.component'

const routes: Routes = [
  {
    path: '',
    component: GalleryComponent
  },
  {
    path: 'subgallery/:id',
    component: SubgalleryComponent
  }  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GalleryRoutingModule {}
