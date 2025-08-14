import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { academicLevelDataModel, TeacherFileModel } from '../../models/models';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../service/auth.service';
import { IncludesRolePipe } from '../../Pipe/includes-role.pipe';
import { LottieLoaderComponent } from '../../lottie-loader/lottie-loader.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tasks',
  imports: [DataView,
    ButtonModule,
    CommonModule,
    FormsModule,
    FileUploadModule,
    ToastModule, RouterModule,
    InputIconModule,
    FloatLabelModule, InputTextModule,
    DropdownModule, CheckboxModule, IncludesRolePipe, LottieLoaderComponent
  ],
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [MessageService]
})

export class TasksComponent {
  //شوف هتستخدم ال user id ولا الstudent id and academicLevelId

  teacherId!: number
  chapterId!: number
  tasksFiles: any[] = [];
  studentId: number = 3
  academicLevelId: number = 4
  Filter!: TeacherFileModel
  academicLevelData: academicLevelDataModel[] = [];
  totalRecords: number = 0;
  loading: boolean = true;

  layout: 'list' | 'grid' = 'list';

  options = ['list', 'grid'];
  studentEmail: string;
  roles: any;
  Loading: boolean = false

  constructor(private tasksAndVideos: TasksAndVideosService, private route: ActivatedRoute, private messageService: MessageService, private router: Router, private authService: AuthService) {
    //Get student id here 

    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = +teacherId
    }
    const chapterId = sessionStorage.getItem('chapterId');
    if (chapterId) {
      this.chapterId = +chapterId
    }
    this.studentEmail = this.authService.getUserEmail();
  }

  ngOnInit() {
    this.Filter =
    {
      teacherId: this.teacherId,
      chapterId: this.chapterId,
      academicLevelId: this.academicLevelId,
      isBook: false,
      pageNumber: 1,
      pageSize: 10
    }

    this.getPDFiles()
    this.getAcademicLevelFilter()
    this.roles = this.authService.getUserTokenRoles();
  }

  getPDFiles() {
    this.loading = true;
    this.tasksAndVideos.getTeachersFiles(this.Filter).subscribe({
      next: (data) => {
        this.tasksFiles = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
        this.loading = false;
      }
    });
  }

  loadTasks(event: LazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 25;

    this.Filter.pageNumber = Math.floor(first / rows) + 1;
    this.Filter.pageSize = rows;

    this.getPDFiles();
  }
  getAcademicLevelFilter() {
    this.tasksAndVideos.getAllAcademicLevels().subscribe({
      next: (data) => {
        this.academicLevelData = data
      }
    });

  }

downloadTask(fileName: string) {
  this.Loading = true;

  this.tasksAndVideos.downloadFile(fileName, this.Filter.isBook)
    .pipe(finalize(() => this.Loading = false))
    .subscribe({
      next: (response) => {
        const contentType = this.Filter.isBook ? 'application/pdf' : (response.body?.type || '');
        const blob = new Blob([response.body!], { type: contentType });
        const url = window.URL.createObjectURL(blob);

        if (this.Filter.isBook) {
          window.open(`/assets/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}`, '_blank');
        } else {
          let downloadedFileName = fileName;
          const contentDisposition = response.headers.get('Content-Disposition');
          if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match && match[1]) downloadedFileName = match[1].replace(/['"]/g, '');
          }
          const a = document.createElement('a');
          a.href = url;
          a.download = downloadedFileName;
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error: (err) => console.error('Error downloading file:', err)
    });
}


  uploadTask(event: any, filesID: number, teacherID: number, isAnswer: boolean, academicLevelID: number, taskName: string, taskNameAnswer: string) {
    this.Loading = true
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileID', filesID.toString());
    formData.append('studentEmail', this.studentEmail);
    formData.append('teacherId', teacherID.toString());
    formData.append('isAnswer', isAnswer.toString());
    // formData.append('academicLevelID', academicLevelID.toString());
    formData.append('taskName', taskName);
    formData.append('answerName', taskNameAnswer);

    this.tasksAndVideos.uploadFile(formData).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully!' });
        this.getPDFiles()
        this.Loading = false
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Upload failed!' });
        this.Loading = false
      },
    });
  }

  navigateWithFileId(fileid: number) {
    sessionStorage.setItem('fileId', fileid.toString());
    this.router.navigate(['/pages/teachers/chaptersDashboard/videos-and-tasks/studentTasksDashboard']);
  }

  onFilterChange() {
    this.getPDFiles()
  }
}
