import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbItems = this.buildBreadCrumb(this.activatedRoute.root);
      });
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) return breadcrumbs;

    for (const child of children) {
      if (child.outlet !== PRIMARY_OUTLET) continue;

      if (child.snapshot.url.length !== 0) {
        const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
        url += `/${routeURL}`;
        const label = child.snapshot.data['breadcrumb'] || this.formatLabel(routeURL);

        // Inject 'Chapters Dashboard' manually if inside videos-and-tasks
        if (
          url.includes('chaptersDashboard/videos-and-tasks') &&
          !breadcrumbs.some(b => b.label === 'Chapters Dashboard')
        ) {
          breadcrumbs.push({
            label: 'Chapters Dashboard',
            routerLink: '/pages/teachers/chaptersDashboard'
          });
        }

        // Skip 'videos-and-tasks' from breadcrumbs
        if (routeURL !== 'videos-and-tasks') {
          breadcrumbs.push({
            label,
            routerLink: url
          });
        }
      }

      return this.buildBreadCrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  formatLabel(segment: string): string {
    const mapping: { [key: string]: string } = {
      teachers: 'Teachers',
      chaptersDashboard: 'Chapters Dashboard',
      tasks: 'Tasks',
      videos: 'Videos',
      VideoPlayer: 'Video',
      createNewChapter: 'Create Chapter'
    };

    return mapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
