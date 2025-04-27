import { Component } from '@angular/core';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel'

@Component({
  selector: 'app-video-player',
  imports: [CommonModule, CardModule,
    BadgeModule,
    DividerModule,
    ScrollPanelModule,],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  standalone : true
})
export class VideoPlayerComponent {

  videoUrl!: string
  videoName!: string
  constructor(private tasksAndVideosService: TasksAndVideosService) {

    const videoName = sessionStorage.getItem('videoName')
    if (videoName) {
      this.videoName = videoName
    }

  }

  ngOnInit() {
    this.getVideoFile()
  }

  getVideoFile() {
    this.tasksAndVideosService.getVideoFile(this.videoName).subscribe({
      next: (data) => {
        this.videoUrl = URL.createObjectURL(data);
        console.log("🚀 ~ VideoPlayerComponent ~ this.tasksAndVideosService.getVideoById ~ this.videoUrl:", this.videoUrl)
      }
    });
  }


  
}
