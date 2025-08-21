import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadVideosComponent } from './upload-videos.component';

const routes: Routes = [
  {
    path: '',
    component: UploadVideosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadVideosRoutingModule {}
