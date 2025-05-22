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

@Component({
  selector: 'app-chapters-dashboard',
  imports: [AnimateOnScrollModule, CardModule, CommonModule, RouterModule, FloatLabelModule, InputIconModule, DropdownModule, FormsModule, InputTextModule],
  templateUrl: './chapters-dashboard.component.html',
  styleUrl: './chapters-dashboard.component.scss',
  standalone: true
})

export class ChaptersDashboardComponent {
  teacherId!: string
  Filter!: ChapterModel
  Chapters: any[] = [];
  academicLevelData: academicLevelDataModel[] = [];

  constructor(private tasksAndVideos: TasksAndVideosService, private chaptersService: ChaptersService,) {
    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = teacherId
    }
  }

  ngOnInit(): void {
    this.Filter =
    {
      teacherId: this.teacherId,
      pageNumber: 1,
      pageSize: 25
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




}
