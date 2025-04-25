import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressBar } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { academicLevelDataModel } from '../../models/models';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-upload-videos',
  imports: [CommonModule, FileUploadModule, FloatLabelModule, DropdownModule, FormsModule, ButtonModule, ProgressBar, BadgeModule, ToastModule,InputTextModule],
  templateUrl: './upload-videos.component.html',
  styleUrl: './upload-videos.component.scss',
  standalone: true,
  providers: [MessageService]

})
export class UploadVideosComponent {

  selectedVideo: File | null = null;
  chunkSize = 10 * 1024 * 1024 // 150 M
  uploadProgress = 0;
  userId = 1;
  teacherId!: string
  isPending: boolean = true
  academicLevelData: academicLevelDataModel[] = [];
  VideoName!: string;

  academicLevelID! : number
  constructor( private tasksAndVideosService: TasksAndVideosService, private messageService: MessageService) {

    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = teacherId

    }

  }

  ngOnInit() {
    this.getAcademicLevelFilter()
  }

  getAcademicLevelFilter() {
    this.tasksAndVideosService.getAllAcademicLevels().subscribe({
      next: (data) => {
        this.academicLevelData = data
      }
    });

  }

  onVideoSelected(event: any) {
    this.selectedVideo = event.files[0];
  }

  uploadVideo() {

    if (!this.VideoName || !this.academicLevelID) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تنبيه',
        detail: 'يرجى تحديد اسم الفديو ومرحلة الدراسة قبل الرفع.',
      });
      return;
    }

    if (!this.selectedVideo) return;
    console.log("🚀 ~ UploadVideosComponent ~ onVideoSelected ~ this.selectedVideo:", this.selectedVideo)

    const totalChunks = Math.ceil(this.selectedVideo.size / this.chunkSize);
    const fileName = this.selectedVideo.name;
    let currentChunk = 0;

    const uploadChunk = () => {
      const start = currentChunk * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.selectedVideo!.size);
      const chunk = this.selectedVideo!.slice(start, end);

      const formData = new FormData();
      formData.append('FileName', fileName);
      formData.append('Chunk', chunk);
      formData.append('ChunkNumber', (currentChunk + 1).toString());
      formData.append('TotalChunks', totalChunks.toString());
      formData.append('UserId', '1');
      formData.append('TeacherId', this.teacherId);
      formData.append('AcademicLevelId', this.academicLevelID.toString());

      this.tasksAndVideosService.uploadFileChunk(formData).subscribe({
        next: (data) => {
          currentChunk++;
          this.uploadProgress = Math.round((currentChunk / totalChunks) * 100);
          if (currentChunk < totalChunks) {
            uploadChunk();
          } else {
            if (data.isValidTransaction) {
            this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم رفع الفيديو بنجاح' });
            this.uploadProgress = 0;
            this.selectedVideo = null;
              this.isPending = false
            }
            else {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: data.transactionDetails,
              });
            }
          }
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل رفع الفيديو' });
        }
      });
    };

    uploadChunk();
  }


  choose(event: Event, callback: Function) {
    this.isPending = true
    event.preventDefault();
    callback();
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
  }

  onRemoveVideo(removeFn: Function, index: number) {
    removeFn(index);
    this.selectedVideo = null;
  }

  resetVideoSelection(clearFn: Function) {
    clearFn();
    this.selectedVideo = null;
    this.uploadProgress = 0;
    this.isPending = true;
  }

};
