import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-upload-tasks',
  standalone: true,
  imports: [FileUpload, ButtonModule, BadgeModule, ProgressBar, ToastModule, HttpClientModule, CommonModule],
  templateUrl: './upload-tasks.component.html',
  styleUrls: ['./upload-tasks.component.scss'], 
  providers: [MessageService]
})
export class UploadTasksComponent {
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(private config: PrimeNG, private messageService: MessageService) {}

  choose(event: any, callback: () => void): void {
    if (callback) {
      callback();
    }
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: (event: any, index: number) => void, index: number): void {
    if (removeFileCallback) {
      removeFileCallback(event, index);
    }
    this.totalSize -= file.size; 
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: () => void): void {
    if (clear) {
      clear();
    }
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload(): void {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event: any): void {
    console.log("🚀 ~ UploadTasksComponent ~ onSelectedFiles ~ event:", event)
    this.files = event.currentFiles || [];
    console.log("🚀 ~ UploadTasksComponent ~ onSelectedFiles ~ this.files:", this.files)
    
    this.totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: () => void): void {
    if (callback) {
      callback();
    }
  }

  formatSize(bytes: number): string {
    if (!this.config.translation || !this.config.translation.fileSizeTypes) {
      return `${bytes} B`; 
    }

    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i] || 'B'}`;
  }
}
