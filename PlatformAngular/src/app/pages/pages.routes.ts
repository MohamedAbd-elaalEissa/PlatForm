import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { TeachersComponent } from './Teachers/teachers.component';
import { AuthGuard } from './auth/authguard';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    //{ path: 'teachers', component: TeachersComponent,canActivate:[AuthGuard] },
    { path: 'teachers', component: TeachersComponent},
    {
        path: 'teachers/videos-and-tasks',
        loadChildren: () => import('./VideosAndTasks/VideosAndTasks.routes')
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
