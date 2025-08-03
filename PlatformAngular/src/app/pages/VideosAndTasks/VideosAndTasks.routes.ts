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
      { path: 'tasks', component: TasksComponent, data: { breadcrumb: 'المهام' } },
      { path: 'videos', component: VideosComponent, data: { breadcrumb: 'الفديوهات' } },
      { path: 'uploadTasks', component: UploadTasksComponent, data: { breadcrumb: 'رفع المهام' } },
      { path: 'uploadVideos', component: UploadVideosComponent, data: { breadcrumb: 'رفع الفديوهات' } },
      { path: 'VideoPlayer', component: VideoPlayerComponent, data: { breadcrumb: 'مشغل الفديو' } },
    ]
  },
  
  { path: 'studentTasksDashboard', component: StudentTasksDashboardComponent, data: { breadcrumb: 'الطلاب' } }

] as Routes;
