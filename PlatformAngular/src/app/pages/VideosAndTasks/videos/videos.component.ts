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

    constructor(private tasksAndVideos: TasksAndVideosService, private productService: ProductService ,private router: Router) {
        const teacherId = sessionStorage.getItem('teacherId');
        if (teacherId) {
            this.teacherId = teacherId
        }
    }

    ngOnInit() {

        this.Filter =
        {
            teacherId: this.teacherId,
            academicLevelId: this.academicLevelId,
            pageNumber: 1,
            pageSize: 25
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
        this.tasksAndVideos.getTeachersVideos(this.Filter).subscribe({
            next: (data) => {
                this.videosData = data.items;
            },
            error: (err) => {
                console.error('Error fetching teachers:', err);
            }
        });
    }


    viewVideo(videoName :string)
    {
    sessionStorage.setItem("videoName",videoName)
    this.router.navigate(["/pages/teachers/videos-and-tasks/VideoPlayer"]);
    }

}
