import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { AuthGuard } from './auth/authguard';
import { ChaptersDashboardComponent } from './chapters-dashboard/chapters-dashboard.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { TeachersComponent } from './teacher-cards/teacher-cards.component';

export default [
     { path: '', redirectTo: 'teachers', pathMatch: 'full' },
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'teachers', component: TeachersComponent,canActivate:[AuthGuard], data: { breadcrumb: 'Teachers' } },
    // { path: 'card', component: TeacherCardsComponent,canActivate:[AuthGuard] },
    { path: 'chaptersDashboard', component: ChaptersDashboardComponent,canActivate:[AuthGuard] ,data: { breadcrumb: 'ChaptersDashboard' } },
    { path: 'createNewChapter', component: ChaptersComponent,canActivate:[AuthGuard] , data: { breadcrumb: 'CreateNewChapter' } },

    {
        path: 'teachers/videos-and-tasks',
        loadChildren: () => import('./VideosAndTasks/VideosAndTasks.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
