import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { LayoutVideosAndTasksComponent } from './layout-videos-and-tasks/layout-videos-and-tasks.component';
import { VideosComponent } from './videos/videos.component';
import { UploadTasksComponent } from './upload-tasks/upload-tasks.component';
import { StudentTasksDashboardComponent } from './student-tasks-dashboard/student-tasks-dashboard.component';
import { UploadVideosComponent } from './upload-videos/upload-videos.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { ChaptersComponent } from './chapters/chapters.component';

export default [
    {
        path: '',
        component: LayoutVideosAndTasksComponent,
        children: [
            { path: '', redirectTo: 'tasks', pathMatch: 'full' },  
            { path: 'tasks', component: TasksComponent },
            { path: 'videos', component: VideosComponent },
            { path: 'uploadTasks', component: UploadTasksComponent },
            { path: 'uploadVideos', component: UploadVideosComponent },
            { path: 'chapters', component: ChaptersComponent },

        ],
    },
    { path: 'studentTasksDashboard', component: StudentTasksDashboardComponent },
    { path: 'VideoPlayer', component: VideoPlayerComponent }

] as Routes;
