import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Route } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbItems: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbItems = this.buildBreadCrumbFromUrl(this.router.url);
    });
  }

buildBreadCrumbFromUrl(url: string): any[] {
  const segments = url.split('/').filter(segment => segment);
  const breadcrumbs: any[] = [];
  let accumulatedPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    accumulatedPath += `/${segment}`;

    // Inject "الفصول التعليميه" manually if "videos-and-tasks" exists
    if (
      segment === 'videos-and-tasks' &&
      !breadcrumbs.some(b => b.label === 'الفصول التعليميه')
    ) {
      breadcrumbs.push({
        label: 'الفصول التعليميه',
        routerLink: '/pages/teachers/chaptersDashboard'
      });
    }

    // Inject "المهام" manually if "studentTasksDashboard" exists
    if (
      segment === 'studentTasksDashboard' &&
      !breadcrumbs.some(b => b.label === 'المهام')
    ) {
      breadcrumbs.push({
        label: 'المهام',
        routerLink: '/pages/teachers/chaptersDashboard/videos-and-tasks/tasks'
      });
    }

    // Inject "الفيديوهات" manually if "VideoPlayer" exists
    if (
      segment === 'VideoPlayer' &&
      !breadcrumbs.some(b => b.label === 'الفيديوهات')
    ) {
      breadcrumbs.push({
        label: 'الفيديوهات',
        routerLink: '/pages/teachers/chaptersDashboard/videos-and-tasks/videos'
      });
    }

    // Skip 'videos-and-tasks' itself
    if (segment !== 'videos-and-tasks') {
      breadcrumbs.push({
        label: this.formatLabel(segment),
        routerLink: accumulatedPath
      });
    }
  }

  return breadcrumbs;
}


  formatLabel(segment: string): string {
    const mapping: { [key: string]: string } = {
      pages: 'المسارات',
      teachers: 'المعلمين',
      chaptersDashboard: 'الفصول التعليميه',
      tasks: 'المهام',
      videos: 'الفديوهات',
      VideoPlayer: 'مشغل الفديو',
      uploadTasks: 'رفع المهام',
      uploadVideos: 'رفع الفديوهات',
      studentTasksDashboard: 'اجابات الطلاب',
      createNewChapter: 'انشاء فصل '
    };

    return mapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
