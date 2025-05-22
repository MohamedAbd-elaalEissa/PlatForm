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
import { academicLevelDataModel, ChapterModel } from '../../models/models';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ChaptersService } from '../../service/chapters.service';
@Component({
  selector: 'app-upload-videos',
  standalone: true,
  imports: [CommonModule, FileUploadModule, FloatLabelModule, DropdownModule, TableModule,
    FormsModule, ButtonModule, ProgressBar, BadgeModule, ToastModule, DialogModule
    , InputTextModule, ConfirmDialogModule],
  templateUrl: './upload-videos.component.html',
  styleUrl: './upload-videos.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class UploadVideosComponent {

  selectedVideo: File | null = null;
  chunkSize = 5 * 1024 * 1024 // 150 M
  uploadProgress = 0;
  userId = 1;
  teacherId!: string
  isPending!: number  //1 = pending - 2 completed  -3 error
  academicLevelData: academicLevelDataModel[] = [];
  VideoName!: string;
  displayDialog = false;
  Chapters: any[] = [];
  Filter!: ChapterModel
  selectedChapter!: ChapterModel;
  chapterId!: number

  academicLevelID!: number
  constructor(private chapters: ChaptersService, private tasksAndVideosService: TasksAndVideosService, private messageService: MessageService, private confirmationService: ConfirmationService) {

    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = teacherId

    }

  }

  ngOnInit() {
    this.Filter =
    {
      teacherId: this.teacherId.toString(),
      pageNumber: 1,
      pageSize: 25
    }
  
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

  async uploadVideo() {
    if (!this.VideoName || !this.chapterId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تنبيه',
        detail: 'يرجى تحديد اسم الفديو واسم الفصل قبل الرفع.',
      });
      return;
    }

    if (!this.selectedVideo) return;

    const fileName = this.selectedVideo.name;
    const totalChunks = Math.ceil(this.selectedVideo.size / this.chunkSize);

    try {
      const uploadedChunks = await this.checkUploadedChunks(fileName, this.userId);
      let currentChunk = uploadedChunks.length;

      const uploadChunk = () => {
        if (currentChunk >= totalChunks) {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم رفع الفيديو بنجاح',
          });
          this.selectedVideo = null;
          this.isPending = 2;
          this.uploadProgress = 100;
          return;
        }

        const start = currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.selectedVideo!.size);
        const chunk = this.selectedVideo!.slice(start, end);

        const formData = new FormData();
        formData.append('FileName', fileName);
        formData.append('Chunk', chunk);
        formData.append('ChunkNumber', (currentChunk + 1).toString());
        formData.append('TotalChunks', totalChunks.toString());
        formData.append('UserId', this.userId.toString());
        formData.append('TeacherId', this.teacherId);
        formData.append('chapterId', this.chapterId.toString());
        // formData.append('AcademicLevelId', this.academicLevelID.toString());

        this.tasksAndVideosService.uploadFileChunk(formData).subscribe({
          next: (data) => {
            currentChunk++;
            this.uploadProgress = Math.round((currentChunk / totalChunks) * 100);

            if (data.isValidTransaction) {
              uploadChunk();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: data.transactionDetails,
              });
              this.uploadProgress = 0
              this.isPending = 3
              return;
            }
          },
          error: () => {
            debugger
            this.confirmationService.confirm({
              header: 'خطأ',
              message: 'فشل رفع الفيديو. قم بالضغط علي زرار الرفع مره اخري.',
              icon: 'pi pi-exclamation-triangle text-red-500 text-5xl',
              acceptVisible: false,
              rejectVisible: false,
              closeOnEscape: true,
              closable: true
            });
          }
        });
      };

      uploadChunk();

    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'فشل التحقق من الأجزاء المرفوعة',
      });
    }
  }



  checkUploadedChunks(fileName: string, userId: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.tasksAndVideosService.checkUploadedChunks(userId, fileName).subscribe({
        next: (response) => {
          resolve(response.uploadedChunkNumbers || []);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  choose(event: Event, callback: Function) {
    this.isPending = 1
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
    this.uploadProgress = 0;
    this.selectedVideo = null;
  }

  resetVideoSelection(clearFn: Function) {
    clearFn();
    this.selectedVideo = null;
    this.uploadProgress = 0;
    this.isPending = 1;
  }

  onFilterChange() {
    this.getChapterData()
  }

  showDialog() {
    this.getChapterData()
    this.getAcademicLevelFilter()
    this.displayDialog = true;
  }
  getChapterData() {

    this.chapters.getAllChapters(this.Filter).subscribe({
      next: (data) => {
        this.Chapters = data.items;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  onRowSelect(event: any) {
    this.chapterId = event.data.chapterID
    this.messageService.add({ severity: 'info', summary: 'تم اختيار الفصل', detail: event.data.name });
  }

};
