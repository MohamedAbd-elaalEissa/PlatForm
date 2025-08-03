import { Routes } from '@angular/router';
import { AuthGuard } from './auth/authguard';
import { TeachersComponent } from './teacher-cards/teacher-cards.component';
import { ChaptersDashboardComponent } from './chapters-dashboard/chapters-dashboard.component';

export default [
  { path: '', redirectTo: 'teachers', pathMatch: 'full' },

  {
    path: 'teachers',
    component: TeachersComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Teachers' }
  },
  {
    path: 'teachers/chaptersDashboard',
    component: ChaptersDashboardComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'ChaptersDashboard' }
  },
  {
    path: 'teachers/chaptersDashboard/videos-and-tasks',
    loadChildren: () =>
      import('./VideosAndTasks/VideosAndTasks.routes').then((m) => m.default),
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Videos & Tasks' }
  },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
