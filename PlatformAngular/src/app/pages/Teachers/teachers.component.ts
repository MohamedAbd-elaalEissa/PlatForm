import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { TeachersService } from '../service/teachers.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignalrService } from '../service/signalr.service';
@Component({
  selector: 'app-teachers',
  imports: [AnimateOnScrollModule, CardModule,CommonModule,RouterModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
})


export class TeachersComponent {
  teachers: any;

  constructor(private teachersService: TeachersService,private signalRService: SignalrService ) {}

  ngOnInit(): void {
    this.getAllTeacher()
    this.signalRService.startConnection("Memo@gamil.com");

  }

  getAllTeacher() {

    this.teachersService.getAllTeachers().subscribe({
      next: (data) => {
        this.teachers = data; 
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });

  }

  saveInLocalStorage(teacherId : string)
  {
    sessionStorage.setItem('teacherId', teacherId);
  }

  
}
