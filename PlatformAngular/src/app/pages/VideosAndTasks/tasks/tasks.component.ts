import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { TeacherFileModel } from '../../models/models';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-tasks',
  imports: [DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    FileUploadModule,
    ToastModule,RouterModule,
    InputIconModule,
    FloatLabelModule,InputTextModule
  ],
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [MessageService]
})
export class TasksComponent {
//شوف هتستخدم ال user id ولا الstudent id and academicLevelId

  teacherId!: number
  tasksFiles: any[] = [];
  studentId: number = 3
  academicLevelId : number = 4 
  Filter! : TeacherFileModel 

  layout: 'list' | 'grid' = 'list';

  options = ['list', 'grid'];

  constructor(private  tasksAndVideos: TasksAndVideosService, private route: ActivatedRoute, private messageService: MessageService ,private router: Router) {
    //Get student id here 

    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = +teacherId
    }
  }

  
  ngOnInit() {
    this.Filter =
    {
      teacherId: this.teacherId,
      academicLevelId : this.academicLevelId,
      pageNumber: 1,
      pageSize: 25
    }
  
    this.getPDFiles()
  }

  getPDFiles() {
  
    this.tasksAndVideos.getTeachersFiles(this.Filter).subscribe({
      next: (data) => {
        this.tasksFiles = data.items;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  downloadTask(fileName: string) {
    this.tasksAndVideos.downloadFile(fileName).subscribe({
      next: (response) => {
        const blob = new Blob([response.body!], { type: response.body?.type });

        const contentDisposition = response.headers.get('Content-Disposition');
        let downloadedFileName = fileName;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            downloadedFileName = match[1].replace(/['"]/g, '');
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadedFileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
      }
    });
  }
  uploadTask(event: any, filesID: number, studentId: number, teacherID: number, isAnswer: boolean, academicLevelID: number, taskName: string, taskNameAnswer: string) {
    
    const file = event.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileID', filesID.toString());
    formData.append('studentId', studentId ? studentId.toString() : '');
    formData.append('teacherId', teacherID.toString());
    formData.append('isAnswer', isAnswer.toString());
    formData.append('academicLevelID', academicLevelID.toString());
    formData.append('taskName', taskName);
    formData.append('answerName', taskNameAnswer);

    this.tasksAndVideos.uploadFile(formData).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'File uploaded successfully!'});
        this.getPDFiles()
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Upload failed!'});
      },
    });
  }

  navigateWithFileId(fileid: number) {
    sessionStorage.setItem('fileId', fileid.toString());
    this.router.navigate(['/pages/teachers/videos-and-tasks/studentTasksDashboard']);
  }

  onFilterChange() {
    this.getPDFiles()
  }
}
