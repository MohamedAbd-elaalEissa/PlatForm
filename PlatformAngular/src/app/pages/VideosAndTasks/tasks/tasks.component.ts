import { Component } from '@angular/core';
import { ProductService, Product } from '../../service/product.service';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { TeachersService } from '../../service/teachers.service';
import { ActivatedRoute } from '@angular/router';
import { FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-tasks',
  imports: [DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    FileUploadModule,
    ToastModule
  ],
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  providers: [ProductService,MessageService]
})
export class TasksComponent {

  teacherId!: number
  tasksFiles: any;
  studentId: number = 3

  layout: 'list' | 'grid' = 'list';

  products = signal<any>([]);

  options = ['list', 'grid'];

  constructor(private productService: ProductService, private teachersService: TeachersService, private route: ActivatedRoute, private messageService: MessageService) {
    //Get student id here 

    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = +teacherId
    }
  }


  ngOnInit() {
    this.productService.getProducts().then((data) => {
      this.products.set([...data]);
    });

    this.getPDFiles()
  }

  getPDFiles() {
    this.teachersService.getTeachersFiles(this.teacherId).subscribe({
      next: (data) => {
        this.tasksFiles = data;
        console.log("🚀 ~ TasksComponent ~ this.teachersService.getTeachersFiles ~ this.tasksFiles:", this.tasksFiles)
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  downloadTask(fileName: string) {
    this.teachersService.downloadFile(fileName).subscribe({
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

    this.teachersService.uploadFile(formData).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'File uploaded successfully!'});
        this.getPDFiles()
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Upload failed!'});
      },
    });
  }
}
