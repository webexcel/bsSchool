import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Guard, loginGuard } from './_guards';
import { CalenderComponent } from './calender/calender.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [loginGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [Guard],
  },
  {
    path: 'circulars',
    loadChildren: () =>
      import('./circulars/circulars.module').then((m) => m.CircularsModule),
    canActivate: [Guard],
  },
  {
    path: 'homework',
    loadChildren: () =>
      import('./homework/homework.module').then((m) => m.HomeworkModule),
    canActivate: [Guard],
  },
  {
    path: 'report-card',
    loadChildren: () =>
      import('./report-card/report-card.module').then(
        (m) => m.ReportCardModule
      ),
    canActivate: [Guard],
  },
  {
    path: 'calender',
    component: CalenderComponent,
    canActivate: [Guard],
  },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./gallery/gallery.module').then((m) => m.GalleryModule),
    canActivate: [Guard],
  },
  {
    path: 'exam-schedule',
    loadChildren: () =>
      import('./exam-schedule/exam-schedule.module').then(
        (m) => m.ExamScheduleModule
      ),
    canActivate: [Guard],
  },
  {
    path: 'news-events',
    loadChildren: () =>
      import('./news-events/news-events.module').then(
        (m) => m.NewsEventsModule
      ),
    canActivate: [Guard],
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./attendance/attendance.module').then((m) => m.AttendanceModule),
    canActivate: [Guard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [Guard],
  },
  {
    path: 'language',
    loadChildren: () =>
      import('./language/language.module').then((m) => m.LanguageModule),
    canActivate: [Guard],
  },
  {
    path: 'timetable',
    loadChildren: () =>
      import('./timetable/timetable.module').then((m) => m.TimetableModule),
    canActivate: [Guard],
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./payment/payment.module').then((m) => m.PaymentModule),
    canActivate: [Guard],
  },
  {
    path: 'leave',
    loadChildren: () =>
      import('./leave/leave.module').then((m) => m.LeaveModule),
    canActivate: [Guard],
  },

  {
    path: 'annual-report',
    loadChildren: () =>
      import('./annual-report/annual-report.module').then(
        (m) => m.AnnualReportModule
      ),
    canActivate: [Guard],
  },

  {
    path: 'knowledge-base',
    loadChildren: () =>
      import('./knowledge-base/knowledge-base.module').then(
        (m) => m.KnowledgeBasePageModule
      ),
  },

  {
    path: 'upload-videos',
    loadChildren: () =>
      import('./upload-videos/upload-videos.module').then(
        (m) => m.UploadVideosModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
