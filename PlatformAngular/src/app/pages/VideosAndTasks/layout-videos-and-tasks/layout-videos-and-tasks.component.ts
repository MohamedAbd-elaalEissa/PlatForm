import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { IncludesRolePipe } from '../../Pipe/includes-role.pipe';

@Component({
  selector: 'app-layout-videos-and-tasks',
  imports: [TabsModule, CommonModule, RouterModule,IncludesRolePipe],
  templateUrl: './layout-videos-and-tasks.component.html',
  styleUrl: './layout-videos-and-tasks.component.scss'
})
export class LayoutVideosAndTasksComponent {
  roles: any;
  constructor(private authService:AuthService) { }

  ngOnInit() {
   this.roles=this.authService.getUserTokenRoles();
  }

}
