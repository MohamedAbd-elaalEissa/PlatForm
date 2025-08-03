import { Routes } from '@angular/router';
import { AuthGuard } from './auth/authguard';
import { TeachersComponent } from './teacher-cards/teacher-cards.component';
import { ChaptersDashboardComponent } from './chapters-dashboard/chapters-dashboard.component';
import { ChaptersComponent } from './chapters/chapters.component';

export default [
  { path: '', redirectTo: 'teachers', pathMatch: 'full' },

  {
    path: 'teachers',
    component: TeachersComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'المعلمين' }
  },
  {
    path: 'teachers/chaptersDashboard',
    component: ChaptersDashboardComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'الفصول' }
  },
  {
    path: 'teachers/chaptersDashboard/createNewChapter',
    component: ChaptersComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'انشاء فصل' }
  },
  {
    path: 'teachers/chaptersDashboard/videos-and-tasks',
    loadChildren: () =>
      import('./VideosAndTasks/VideosAndTasks.routes').then((m) => m.default),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/notfound' }
] as Routes;
