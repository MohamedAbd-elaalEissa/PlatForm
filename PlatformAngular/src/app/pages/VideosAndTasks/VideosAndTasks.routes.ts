import { Routes } from '@angular/router';
import { LayoutVideosAndTasksComponent } from './layout-videos-and-tasks/layout-videos-and-tasks.component';
import { TasksComponent } from './tasks/tasks.component';
import { VideosComponent } from './videos/videos.component';
import { UploadTasksComponent } from './upload-tasks/upload-tasks.component';
import { UploadVideosComponent } from './upload-videos/upload-videos.component';
import { StudentTasksDashboardComponent } from './student-tasks-dashboard/student-tasks-dashboard.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { AuthGuard } from '../auth/authguard';
import { RoleGuard } from '../auth/RoleGuard';

export default [
  {
    path: '',
    component: LayoutVideosAndTasksComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent,data: { breadcrumb: 'المهام'} },
      { path: 'videos', component: VideosComponent,data: { breadcrumb: 'الفديوهات'} },
      { path: 'uploadTasks', component: UploadTasksComponent,  canActivate: [RoleGuard],data: { breadcrumb: 'رفع المهام', role: 'Teacher' } },
      { path: 'uploadVideos', component: UploadVideosComponent, canActivate: [RoleGuard], data: { breadcrumb: 'رفع الفديوهات', role: 'Teacher' } },
      { path: 'VideoPlayer', component: VideoPlayerComponent, data: { breadcrumb: 'مشغل الفديو' } },
    ]
  },
  
  { path: 'studentTasksDashboard', component: StudentTasksDashboardComponent,  canActivate: [RoleGuard],data: { breadcrumb: 'الطلاب' , role: 'Teacher'} }

] as Routes;
