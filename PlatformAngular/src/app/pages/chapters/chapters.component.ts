import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { TasksAndVideosService } from '../service/tasks-and-videos.service';
import { academicLevelDataModel, ChapterModel, ChapterUpdateModel } from '../models/models';
import { DropdownModule } from 'primeng/dropdown';
import { ChaptersService } from '../service/chapters.service';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-chapters',
  imports: [TableModule, ToastModule, CommonModule, TagModule, SelectModule,
    ButtonModule, InputTextModule, FormsModule, FloatLabelModule, InputIconModule, DropdownModule,
    ConfirmDialogModule, DialogModule],
  templateUrl: './chapters.component.html',
  standalone: true,
  styleUrl: './chapters.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ChaptersComponent {

  teacherId!: string
  academicLevelData: academicLevelDataModel[] = [];
  Filter!: ChapterModel
  Chapters: any[] = [];
  academicLevelId!: number
  clonedChapter: { [s: string]: ChapterModel } = {};
  statuses!: SelectItem[];
  visible: boolean = false;
  newChapter!: ChapterModel
  totalRecords: number = 0;
  loading: boolean = true;

  constructor(private tasksAndVideos: TasksAndVideosService, private confirmationService: ConfirmationService,
    private chapters: ChaptersService, private messageService: MessageService) {

    const teacherId = sessionStorage.getItem('teacherId');
    if (teacherId) {
      this.teacherId = teacherId
    }
  }

  ngOnInit() {

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
    this.loading = true;
    this.chapters.getAllChapters(this.Filter).subscribe({
      next: (data) => {
        this.Chapters = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching chapters:', err);
        this.loading = false;
      }
    });
  }

  loadChapters(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 25;
    this.Filter.pageNumber = Math.floor(first / rows) + 1;
    this.Filter.pageSize = rows;

    this.getChapterData();
  }

  onRowEditInit(chapter: ChapterModel) {
    if (chapter?.chapterID !== undefined) {
      this.clonedChapter[chapter.chapterID] = { ...chapter };
    }
  }

  onRowEditSave(chapter: ChapterModel) {
    if (chapter.chapterName && chapter.chapterID && chapter.academicLevelId) {
      let obj: ChapterUpdateModel = {
        ChapterID: chapter.chapterID,
        teacherId: chapter.teacherId,
        academicLevelId: chapter.academicLevelId,
        chapterName: chapter.chapterName
      };
      this.chapters.updateChapter({ chapter: obj }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'تم التحديث', detail: 'تم تعديل الفصل بنجاح' });
          delete this.clonedChapter[chapter.chapterID as string];
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'حدث خطأ أثناء التعديل' });
        }
      });
    }
  }

  onRowEditCancel(chapter: ChapterModel, index: number) {
    if (chapter?.chapterID !== undefined) {
      this.Chapters[index] = this.clonedChapter[chapter.chapterID];
      delete this.clonedChapter[chapter.chapterID];
    }
  }
  confirmDelete(chapter: ChapterModel) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف  "${chapter.chapterName}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'إلغاء',
      accept: () => {
        this.deleteChapter(chapter);
      }
    });
  }

  deleteChapter(chapter: ChapterModel) {
    if (chapter.chapterID) {
      this.chapters.deleteChapter(+chapter.chapterID).subscribe(() => {
        this.Chapters = this.Chapters.filter(c => c.chaptersID !== chapter.chapterID);
        this.messageService.add({ severity: 'success', summary: 'تم الحذف', detail: 'تم حذف الفصل بنجاح' });
      });
    }
  }

  createChapter() {
    if (!this.newChapter || !this.newChapter.chapterName || this.newChapter.academicLevelId == null) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة: اسم الفصل و المرحلة الدراسية.',
        life: 3000
      });
      return;
    }

    this.chapters.createChapter({ chapter: this.newChapter }).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'تم الإضافة بنجاح',
          detail: 'تم إضافة الفصل بنجاح.',
          life: 3000
        });
        this.getChapterData()
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ في الإضافة',
          detail: 'حدث خطأ أثناء إضافة الفصل.',
          life: 3000
        });
      }
    );
  }

  getAcademicLevelName(id: number): string {
    const level = this.academicLevelData.find(x => x.academicLevelID === id);
    return level ? level.academicLevelName : 'غير معروف';
  }

  onFilterChange() {
    this.getChapterData()
  }

  showDialog() {
    this.visible = true;
    this.newChapter = {} as ChapterModel;
    this.newChapter = {
      teacherId: this.teacherId,
    };
  }

}
