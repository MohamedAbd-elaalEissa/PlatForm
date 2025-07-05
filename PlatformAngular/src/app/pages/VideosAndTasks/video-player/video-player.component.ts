import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule, CardModule, BadgeModule, DividerModule, ScrollPanelModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements AfterViewChecked {
  @ViewChild('plyrVideo') plyrVideo!: ElementRef;

  videoUrl = '';
  videoName = '';
  isPlayerReady = false;
  private playerInitialized = false;

  constructor(
    private tasksAndVideosService: TasksAndVideosService,
    private cdr: ChangeDetectorRef
  ) {
    const videoName = sessionStorage.getItem('videoName');
    if (videoName) {
      this.videoName = videoName;
    }
  }

  ngOnInit() {
    this.getVideoFile();
  }

  ngAfterViewChecked() {
    if (this.videoUrl && this.plyrVideo?.nativeElement && !this.playerInitialized) {
      const player = new Plyr(this.plyrVideo.nativeElement, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
        disableContextMenu: true,
      });

      this.plyrVideo.nativeElement.addEventListener('contextmenu', (e: Event) => {
        e.preventDefault();
      });

      this.isPlayerReady = true;
      this.playerInitialized = true;
      this.cdr.detectChanges();
    }
  }

  getVideoFile() {
    this.tasksAndVideosService.getVideoFile(this.videoName).subscribe({
      next: (response) => {
        this.videoUrl = response.url;
      }
    });
  }
}
