import { Component, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StudentAnswerFilterModel, TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-student-tasks-dashboard',
  imports: [FileUploadModule,TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './student-tasks-dashboard.component.html',
  styleUrl: './student-tasks-dashboard.component.scss',
  standalone: true,

})
export class StudentTasksDashboardComponent {
  studentAnswer: any[] = [];
  academicLevelId: number = 4
  studentAnswerData: any;
  teacherId!: number;
  loading: boolean = true;
  fileId!: number;
  Filter! : StudentAnswerFilterModel 

  constructor(private tasksAndVideos: TasksAndVideosService) {
    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = +teacherId
    }
    const fileId = sessionStorage.getItem('fileId');
    if (fileId) {
      this.fileId = +fileId
    }
  }

  ngOnInit() {
    this.Filter =
    {
      teacherId: this.teacherId,
      filesId: this.fileId,
      pageNumber: 1,
      pageSize: 25
    }
    this.getStudentAnswer()
  }

  getStudentAnswer() {
   

    this.tasksAndVideos.getStudentAnswer( this.Filter).subscribe({
      next: (data) => {
        this.studentAnswerData = data.items;

        console.log("🚀 ~ TasksComponent ~ this.tasksAndVideos.getStudentAnswer ~ this.tasksAndVideos:", this.studentAnswerData);
        this.loading = false;

      },
      error: (err) => {
        console.error('Error fetching StudentAnswer:', err);
        this.loading = false;

      }
    });
  }

  onFilterChange() {
    this.getStudentAnswer()
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

}
