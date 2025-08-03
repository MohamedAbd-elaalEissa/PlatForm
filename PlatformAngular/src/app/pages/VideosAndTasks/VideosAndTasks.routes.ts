import { Routes } from '@angular/router';
import { LayoutVideosAndTasksComponent } from './layout-videos-and-tasks/layout-videos-and-tasks.component';
import { TasksComponent } from './tasks/tasks.component';
import { VideosComponent } from './videos/videos.component';
import { UploadTasksComponent } from './upload-tasks/upload-tasks.component';
import { UploadVideosComponent } from './upload-videos/upload-videos.component';
import { StudentTasksDashboardComponent } from './student-tasks-dashboard/student-tasks-dashboard.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

export default [
  {
    path: '',
    component: LayoutVideosAndTasksComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent, data: { breadcrumb: 'Tasks' } },
      { path: 'videos', component: VideosComponent, data: { breadcrumb: 'Videos' } },
      { path: 'uploadTasks', component: UploadTasksComponent, data: { breadcrumb: 'Upload Tasks' } },
      { path: 'uploadVideos', component: UploadVideosComponent, data: { breadcrumb: 'Upload Videos' } },
      { path: 'VideoPlayer', component: VideoPlayerComponent, data: { breadcrumb: 'Video' } }
    ]
  },
  { path: 'studentTasksDashboard', component: StudentTasksDashboardComponent, data: { breadcrumb: 'Student Tasks' } }
] as Routes;
