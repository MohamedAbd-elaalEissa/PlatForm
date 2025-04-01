import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';
import { TeachersService } from '../service/teachers.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teachers',
  imports: [AnimateOnScrollModule, CardModule,CommonModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
})

export class TeachersComponent {
  teachers: any;

  constructor(private teachersService: TeachersService) {}

  ngOnInit(): void {
    this.getAllTeacher()
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


}
