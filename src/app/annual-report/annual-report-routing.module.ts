import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnualReportComponent } from './annual-report.component';

const routes: Routes = [
  {
    path: '',
    component: AnnualReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnualReportRoutingModule {}
