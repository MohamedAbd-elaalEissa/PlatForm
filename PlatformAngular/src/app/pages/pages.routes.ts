import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { TeachersComponent } from './Teachers/teachers.component';
import { AuthGuard } from './auth/authguard';
import { ChaptersDashboardComponent } from './chapters-dashboard/chapters-dashboard.component';
import { ChaptersComponent } from './chapters/chapters.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'teachers', component: TeachersComponent,canActivate:[AuthGuard] },
    { path: 'chaptersDashboard', component: ChaptersDashboardComponent,canActivate:[AuthGuard] },
    { path: 'createNewChapter', component: ChaptersComponent,canActivate:[AuthGuard] },

    {
        path: 'teachers/videos-and-tasks',
        loadChildren: () => import('./VideosAndTasks/VideosAndTasks.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
