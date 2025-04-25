import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FloatLabelModule } from 'primeng/floatlabel';
import { academicLevelDataModel } from '../../models/models';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-upload-tasks',
  standalone: true,
  imports: [FileUpload, ButtonModule, BadgeModule, ProgressBar,
    ToastModule, HttpClientModule, CommonModule, InputTextModule,
    FormsModule, MultiSelectModule, FloatLabelModule, DropdownModule],
  templateUrl: './upload-tasks.component.html',
  styleUrls: ['./upload-tasks.component.scss'],
  providers: [MessageService]
})
export class UploadTasksComponent {
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  teacherId!: number
  userId: number = 1
  taskName!: string;
  academicLevelID!: number;
  academicLevelData: academicLevelDataModel[] = [];
  uploadedFiles: any[] = [];
  isPending: boolean = true

  constructor(private config: PrimeNG, private messageService: MessageService, private tasksAndVideos: TasksAndVideosService) {
    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = +teacherId
    }
  }
  ngOnInit() {
    this.getAcademicLevelFilter()
  }

  choose(event: any, callback: () => void): void {
    this.isPending = true
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

  onSelectedFiles(event: any): void {
    this.files = event.currentFiles || [];
    this.totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(): void {

    if (!this.taskName || !this.academicLevelID) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تنبيه',
        detail: 'يرجى تحديد اسم التاسك ومرحلة الدراسة قبل الرفع.',
      });
      return;
    }

    if (!this.files.length) return;

    const file = this.files[0];
    const formData = new FormData();

    formData.append('file', file);
    formData.append('userId', this.userId.toString());
    formData.append('teacherId', this.teacherId.toString());
    formData.append('isAnswer', "false");
    formData.append('taskName', this.taskName);
    formData.append('academicLevelID', this.academicLevelID.toString());


    this.tasksAndVideos.uploadFile(formData).subscribe({
      next: (data) => {
        if (data.isValidTransaction) {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم رفع الملف بنجاح!',
          });
          this.files = []
          this.isPending = false
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: data.transactionDetails,
          });
        }

      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في رفع الملف!',
        });
      },
    });
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


  getAcademicLevelFilter() {
    this.tasksAndVideos.getAllAcademicLevels().subscribe({
      next: (data) => {
        this.academicLevelData = data
      }
    });

  }

}
