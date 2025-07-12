import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { TeachersService } from '../service/teachers.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignalrService } from '../service/signalr.service';
import { AuthService } from '../service/auth.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-teachers',
  imports: [AnimateOnScrollModule, CardModule, CommonModule, RouterModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
  standalone: true

})

export class TeachersComponent {
  teachers: any;
  email: any;
  private localApi = environment.localApi;

  constructor(private teachersService: TeachersService, private signalRService: SignalrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getAllTeachers()
    this.email = this.authService.getUserEmail();
    this.signalRService.startConnection(this.email);
  }

  getAllTeachers() {
    this.teachersService.getAllTeachers().subscribe({
      next: (data) => {
        this.teachers = data.map((teacher: any) => {
          if (teacher.imagesUrl) {
            const images = teacher.imagesUrl.split('_||_');
            const randomIndex = Math.floor(Math.random() * images.length);
            const selectedImage = images[randomIndex];
            teacher.displayImage = `${this.localApi}/browser/${selectedImage}`;
          } 
          else
           {
            teacher.displayImage = `${this.localApi}/browser/my-profile-icon-blankcircle.png`; 
          }
          return teacher;
        });
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  saveInLocalStorage(teacherId: string, subjectId: any) {

    sessionStorage.setItem('teacherId', teacherId);
    sessionStorage.setItem('subjectId', subjectId);
  }
}
