import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChaptersService } from '../service/chapters.service';
import { academicLevelDataModel, ChapterModel } from '../models/models';
import { TasksAndVideosService } from '../service/tasks-and-videos.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../service/auth.service';
import { StudentService } from '../service/student.service';
import { IncludesRolePipe } from '../Pipe/includes-role.pipe';


@Component({
  selector: 'app-chapters-dashboard',
  imports: [AnimateOnScrollModule, CardModule, CommonModule, RouterModule, FloatLabelModule, InputIconModule,
    DropdownModule, FormsModule, InputTextModule, ButtonModule
    , IncludesRolePipe],
  templateUrl: './chapters-dashboard.component.html',
  styleUrl: './chapters-dashboard.component.scss',
  standalone: true
})

export class ChaptersDashboardComponent {
  teacherId!: string
  Filter!: ChapterModel
  Chapters: any[] = [];
  academicLevelData: academicLevelDataModel[] = [];
  subject: number
  roles: string[] = [];
  email: any;
  studentLevel: any = null
  isStudent: boolean=false;
  constructor(private tasksAndVideos: TasksAndVideosService, private chaptersService: ChaptersService, private authService: AuthService,
    private studentService: StudentService, private router: Router) {
    debugger
    const teacherId = sessionStorage.getItem('teacherId');
    this.subject = Number(sessionStorage.getItem('subjectId'));
    if (teacherId) {
      this.teacherId = teacherId
    }
    this.roles = this.authService.getUserTokenRoles();
    if (!this.roles) {
      this.router.navigate(['/notfound']);

    }


  }

  ngOnInit(): void {
    this.Filter =
    {
      teacherId: this.teacherId,
      pageNumber: 1,
      pageSize: 25,
      academicLevelId: this.studentLevel
    }
    const rolesArray = Array.isArray(this.roles) ? this.roles : [this.roles];
    if (rolesArray.some(role => role.includes('Student'))) {
      this.email = this.authService.getUserEmail();
      this.GetStudentWithEmail();
      this.isStudent=true
    }
    debugger
    if(this.isStudent==false)
    {
      this.getChapterData()
    }
    this.getAcademicLevelFilter()

  }

  getAcademicLevelFilter() {
    this.tasksAndVideos.getAllAcademicLevels().subscribe({
      next: (data) => {
        this.academicLevelData = data
      }
    });
  }

  getChapterData() {
    debugger
    this.chaptersService.getAllChapters(this.Filter).subscribe((data) => {
      debugger
      this.Chapters = data.items;
    });
  }

  saveInSessionStorage(chaptersID: string) {
    sessionStorage.setItem('chapterId', chaptersID);

  }

  getChapterAcademyLevel(academicLevelId: number) {

    return this.academicLevelData.find(a => a.academicLevelID == academicLevelId)?.academicLevelName

  }

  onFilterChange() {
    this.getChapterData()
  }

  async GetStudentWithEmail() {
    await this.studentService.GetStudentWithEmail(this.email).subscribe((res) => {
      debugger
      this.Filter.academicLevelId = res.academicLevelId;
      this.getChapterData()
    });
  }


}
