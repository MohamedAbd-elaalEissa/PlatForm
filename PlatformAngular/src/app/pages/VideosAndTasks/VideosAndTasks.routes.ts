import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { LayoutVideosAndTasksComponent } from './layout-videos-and-tasks/layout-videos-and-tasks.component';
import { VideosComponent } from './videos/videos.component';

export default [
    {
        path: ':id',
        component: LayoutVideosAndTasksComponent,
        children: [
            { path: '', redirectTo: 'tasks', pathMatch: 'full' },  
            { path: 'tasks', component: TasksComponent },
            { path: 'videos', component: VideosComponent }
        ]
    }
] as Routes;
