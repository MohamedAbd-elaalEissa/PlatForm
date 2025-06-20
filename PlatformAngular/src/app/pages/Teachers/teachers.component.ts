import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { TeachersService } from '../service/teachers.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignalrService } from '../service/signalr.service';
import { AuthService } from '../service/auth.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-teachers',
  imports: [AnimateOnScrollModule, CardModule,CommonModule,RouterModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
  standalone : true

})


export class TeachersComponent {
  teachers: any;
  email: any;

  constructor(private teachersService: TeachersService,private signalRService: SignalrService,private authService:AuthService ) {}

  ngOnInit(): void {
    this.getAllTeacher()
    this.email = this.authService.getUserEmail();
    this.signalRService.startConnection(this.email);
  }

  getAllTeacher() {
    this.teachersService.getAllTeachers().subscribe({
      next: (data) => {
        debugger
        this.teachers = data; 
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  saveInLocalStorage(teacherId : string,subjectId:any)
  {
    sessionStorage.setItem('teacherId', teacherId);
    sessionStorage.setItem('subjectId', subjectId);
  }
}
