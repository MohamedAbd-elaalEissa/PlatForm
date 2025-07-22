import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  HostListener,
  OnInit,
} from '@angular/core';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AuthService } from '../../service/auth.service';

interface Position { x: number; y: number; }

@Component({
  selector: 'app-video-player',
  standalone: true,
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  imports: [CommonModule, CardModule, BadgeModule, DividerModule, ScrollPanelModule],
})
export class VideoPlayerComponent implements OnInit, AfterViewChecked {

  @ViewChild('plyrVideo') plyrVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
  videoUrl = '';
  videoName = '';
  watermarkLine1 = '';
  watermarkLine2 = '';

  watermarkText = '';
  watermarkPosition: Position = { x: 5, y: 5 };
  private watermarkTimer!: ReturnType<typeof setInterval>;

  /* === داخلي === */
  private playerInitialized = false;
  UserEmail: string;

  constructor(
    private tasksAndVideosService: TasksAndVideosService,
    private cdr: ChangeDetectorRef,
    private athService: AuthService
  ) {
    this.videoName = sessionStorage.getItem('videoName') ?? '';
    this.UserEmail = this.athService.getUserEmail()
  }

  ngOnInit(): void {
    this.getVideoFile();
    this.initWatermark();
  }

  ngAfterViewChecked(): void {
  if (this.videoUrl && this.plyrVideo?.nativeElement && !this.playerInitialized) {
    const player = new Plyr(this.plyrVideo.nativeElement, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      fullscreen: {
        enabled: true,
        fallback: true,
      },
      disableContextMenu: true,
    });
    player.elements.container = this.videoContainer.nativeElement;
    this.plyrVideo.nativeElement.addEventListener('contextmenu', e => e.preventDefault());
    this.playerInitialized = true;
    this.cdr.detectChanges();
  }
}



  private getVideoFile(): void {
    this.tasksAndVideosService.getVideoFile(this.videoName).subscribe({
      next: res => (this.videoUrl = res.url),
    });
  }

  private initWatermark(): void {
    const userName = this.UserEmail ?? 'Anonymous';
    this.watermarkLine1 = userName;
    this.watermarkLine2 = new Date().toLocaleString('en-US');

    this.moveWatermark();
    this.watermarkTimer = setInterval(() => this.moveWatermark(), 10_000);
  }

  private moveWatermark(): void {
  const container = this.videoContainer?.nativeElement;
  const watermark = container?.querySelector('.watermark') as HTMLElement;

  if (!container || !watermark) return;

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const wmWidth = watermark.offsetWidth;
  const wmHeight = watermark.offsetHeight;
  const maxX = containerWidth - wmWidth;
  const maxY = containerHeight - wmHeight;
  this.watermarkPosition = {
    x: ((Math.random() * maxX) / containerWidth) * 100,
    y: ((Math.random() * maxY) / containerHeight) * 100,
  };
}

  ngOnDestroy(): void {
    clearInterval(this.watermarkTimer);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'PrintScreen') {
      navigator.clipboard?.writeText('');
      alert('عذرًا، لقطات الشاشة غير مسموحة.');
    }
  }
  
}
