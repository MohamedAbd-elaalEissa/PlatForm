import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChaptersService } from '../service/chapters.service';
import { academicLevelDataModel, ChapterModel } from '../models/models';
import { TasksAndVideosService } from '../service/tasks-and-videos.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChemistryBackgroundComponent } from '../shared/chemistry-background/chemistry-background.component';
import { PhysicsBackgroundComponent } from '../shared/physics-background/physics-background.component';
import { EgyptianBackgroundComponent } from '../shared/egyptian-background/egyptian-background.component';
import { BiologyBackgroundComponent } from '../shared/biology-background/biology-background.component';
import { MathBackgroundComponent } from '../shared/math-background/math-background.component';
import { AuthService } from '../service/auth.service';
import { StudentService } from '../service/student.service';
import { IncludesRolePipe } from '../Pipe/includes-role.pipe';


@Component({
  selector: 'app-chapters-dashboard',
  imports: [AnimateOnScrollModule, CardModule, CommonModule, RouterModule, FloatLabelModule, InputIconModule, 
    DropdownModule, FormsModule, InputTextModule,ButtonModule,PhysicsBackgroundComponent
    ,ChemistryBackgroundComponent,EgyptianBackgroundComponent,BiologyBackgroundComponent,MathBackgroundComponent,IncludesRolePipe],
  templateUrl: './chapters-dashboard.component.html',
  styleUrl: './chapters-dashboard.component.scss',
  standalone: true
})

export class ChaptersDashboardComponent {
  teacherId!: string
  Filter!: ChapterModel
  Chapters: any[] = [];
  academicLevelData: academicLevelDataModel[] = [];
  subject:number
  roles: string[]=[];
  email: any;
  studentLevel: any;
  constructor(private tasksAndVideos: TasksAndVideosService, private chaptersService: ChaptersService,
    private authService:AuthService,private studentService:StudentService) {
    debugger
    const teacherId = sessionStorage.getItem('teacherId');
    this.subject = Number(sessionStorage.getItem('subjectId'));
    if (teacherId) {
      this.teacherId = teacherId
    }
    debugger
    this.roles=this.authService.getUserTokenRoles();
    const rolesArray = Array.isArray(this.roles) ? this.roles : [this.roles];
    if (rolesArray.some(role => role.includes('Student'))) {
  debugger;
  this.email = this.authService.getUserEmail();
  this.GetStudentWithEmail();
}

   
  }

  ngOnInit(): void {
    this.Filter =
    {
      teacherId: this.teacherId,
      pageNumber: 1,
      pageSize: 25,
      academicLevelId:(this.studentLevel??null)
    }

    this.getChapterData()
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
    this.chaptersService.getAllChapters(this.Filter).subscribe({
      next: (data) => {
        this.Chapters = data.items;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
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

  GetStudentWithEmail() {
    debugger
    this.studentService.GetStudentWithEmail(this.email).subscribe({
      next: (data) => {
        debugger
        this.studentLevel = data.academicLevelId;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }


}
