import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProductService } from '../../service/product.service';
import { academicLevelDataModel, TeachersVideosDataModel } from '../../models/models';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
@Component({
    selector: 'app-videos',
    templateUrl: './videos.component.html',
    styleUrl: './videos.component.scss',
    standalone: true,
    imports: [
        DataView,
        ButtonModule,
        CommonModule,
        FormsModule,
        FloatLabelModule,
        InputIconModule,
        DropdownModule,
        InputTextModule

    ],
    providers: [ProductService],
})

export class VideosComponent {

    academicLevelData: academicLevelDataModel[] = [];
    Filter!: TeachersVideosDataModel
    teacherId!: string
    academicLevelId: number = 4
    videosData: any[] = [];
    chapterId!: number
    totalRecords: number = 0;
    loading: boolean = true;

    constructor(private tasksAndVideos: TasksAndVideosService, private productService: ProductService, private router: Router) {
        const teacherId = sessionStorage.getItem('teacherId');
        if (teacherId) {
            this.teacherId = teacherId
        }
        const chapterId = sessionStorage.getItem('chapterId');
        if (chapterId) {
            this.chapterId = +chapterId
        }
    }

    ngOnInit() {

        this.Filter =
        {
            teacherId: this.teacherId,
            chapterId: this.chapterId,
            academicLevelId: this.academicLevelId,
            pageNumber: 1,
            pageSize: 10
        }
        this.getVideos()
        this.getAcademicLevelFilter()

    }

    getAcademicLevelFilter() {
        this.tasksAndVideos.getAllAcademicLevels().subscribe({
            next: (data) => {
                this.academicLevelData = data
            }
        });

    }
    onFilterChange() {
        this.getVideos()
    }

    getVideos() {
        this.loading = true;
        this.tasksAndVideos.getTeachersVideos(this.Filter).subscribe({
            next: (data) => {
                this.videosData = data.items;
                this.totalRecords = data.totalCount;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching teachers:', err);
                this.loading = false;
            }
        });
    }

    loadVideos(event: LazyLoadEvent) {

        const first = event.first ?? 0;
        const rows = event.rows ?? 25;

        this.Filter.pageNumber = Math.floor(first / rows) + 1;
        this.Filter.pageSize = rows;

        this.getVideos();
    }

    viewVideo(videoName: string) {
        sessionStorage.setItem("videoName", videoName)
        this.router.navigate(["/pages/teachers/chaptersDashboard/videos-and-tasks/VideoPlayer"]);
    }

}
