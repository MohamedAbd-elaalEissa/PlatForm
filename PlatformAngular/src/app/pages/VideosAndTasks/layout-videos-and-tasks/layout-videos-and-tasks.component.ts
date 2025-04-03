import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-videos-and-tasks',
  imports: [TabsModule,CommonModule,RouterModule],
  templateUrl: './layout-videos-and-tasks.component.html',
  styleUrl: './layout-videos-and-tasks.component.scss'
})
export class LayoutVideosAndTasksComponent {
  teacherId: any;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.teacherId = this.route.snapshot.paramMap.get('id');
  }

}
