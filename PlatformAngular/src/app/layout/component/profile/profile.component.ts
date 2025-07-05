import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { TeachersService } from '../../../pages/service/teachers.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { StudySubject } from '../../../pages/models/models';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../pages/service/auth.service';
import { Router } from '@angular/router';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-profile',
  imports: [ButtonModule, FormsModule, AvatarModule, SelectModule,
    InputTextModule, TextareaModule, InputNumberModule, InputMaskModule, DropdownModule, FileUploadModule, ToastModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [MessageService]
})

export class ProfileComponent {
  teacherData: any;
  profile: any = {};
  SubjectData: StudySubject[] = [];
  selectedImageNames: string[] = [];
  teacherEmail: string;

  constructor(private messageService: MessageService, private teacherService: TeachersService, private athService: AuthService, private router: Router) {
    this.teacherEmail = this.athService.getUserEmail()
  }

  ngOnInit(): void {
    this.getStudySubjectsData()
    this.checkProfileData(this.teacherEmail);
  }

  checkProfileData(email: string) {
    this.teacherService.getTeacherByEmail(email).subscribe({
      next: (teacher) => {
        if (teacher) {
          let displayImage = 'https://localhost:44305/browser/my-profile-icon-blankcircle.png';

          if (teacher.imagesUrl) {
            const images = teacher.imagesUrl.split('_||_');
            const randomIndex = Math.floor(Math.random() * images.length);
            const selectedImage = images[randomIndex];
            displayImage = `https://localhost:44305/browser/${selectedImage}`;
          }
          this.profile = {
            TeacherID: teacher.teacherID,
            FirstName: teacher.firstName,
            LastName: teacher.lastName,
            Email: teacher.email,
            Age: teacher.age == 0 ? 15 : teacher.age,
            PhoneNumber: teacher.phoneNumber,
            Brief: teacher.brief,
            ImagesUrl: teacher.imagesUrl,
            StudySubject: teacher.subject?.name || null,
            SubjectId: teacher.subjectId,
            DisplayImage: displayImage
          };
        }
      },
      error: () => {
      }
    });
  }


  getStudySubjectsData() {
    this.teacherService.getAllStudySubject().subscribe({
      next: (data) => {

        this.SubjectData = data.map((item: any) => ({
          id: item.subjectId,
          name: item.subject
        }));
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'حدث خطأ في بيانات المواد الدراسية',
        });
      }
    });
  }

  onUploadFiles(event: any, uploader: any) {
    this.selectedImageNames = [];

    const files: File[] = event.files;
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    this.teacherService.UploadMultipleImages(formData).subscribe({
      next: (res) => {

        this.selectedImageNames = res;
        this.profile.ImagesUrl = res.join('_||_');
        uploader.clear();
        this.messageService.add({
          severity: 'success',
          summary: 'تم الرفع',
          detail: 'تم رفع الصور بنجاح ✅',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'فشل الرفع',
          detail: 'حدث خطأ أثناء رفع الصور ❌',
        });
      }
    });
  }

  onCancel(): void {
    let hasMissingFields = false;

    if (!this.profile.FirstName?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'الاسم الأول ناقص',
        detail: 'من فضلك أدخل الاسم الأول',
      });
      hasMissingFields = true;
    }

    if (!this.profile.LastName?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'الاسم الأخير ناقص',
        detail: 'من فضلك أدخل الاسم الأخير',
      });
      hasMissingFields = true;
    }

    if (!this.profile.Brief?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'النبذة ناقصة',
        detail: 'من فضلك أدخل نبذة عنك',
      });
      hasMissingFields = true;
    }

    if (!this.profile.ImagesUrl?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'الصورة الشخصية ناقصة',
        detail: 'من فضلك قم برفع صورة شخصية',
      });
      hasMissingFields = true;
    }

    if (this.profile.SubjectId === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'المادة غير محددة',
        detail: 'من فضلك اختر المادة الدراسية',
      });
      hasMissingFields = true;
    }

    if (this.profile.Age === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'العمر غير مدخل',
        detail: 'من فضلك أدخل عمرك',
      });
      hasMissingFields = true;
    }

    if (hasMissingFields) return;

    this.router.navigate(['/pages/teachers']);
  }


  onSaveChanges() {
    if (!this.profile.FirstName) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى إدخال الاسم الأول' });
      return;
    }

    if (!this.profile.LastName) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى إدخال الاسم الأخير' });
      return;
    }

    if (!this.profile.Email) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى إدخال البريد الإلكتروني' });
      return;
    }

    if (!this.profile.Age) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى إدخال العمر' });
      return;
    }

    if (!this.profile.PhoneNumber) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى إدخال رقم الهاتف' });
      return;
    }

    if (!this.profile.SubjectId) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى اختيار المادة الدراسية' });
      return;
    }

    if (!this.profile.ImagesUrl) {
      this.messageService.add({ severity: 'warn', summary: 'بيانات ناقصة', detail: 'يرجى رفع صورة واحدة على الأقل' });
      return;
    }

    const teacherToUpdate = {
      teacherID: this.profile.TeacherID,
      firstName: this.profile.FirstName,
      lastName: this.profile.LastName,
      email: this.profile.Email,
      age: this.profile.Age,
      phoneNumber: this.profile.PhoneNumber,
      brief: this.profile.Brief,
      imagesUrl: this.profile.ImagesUrl,
      subjectId: this.profile.SubjectId
    };
      console.log("🚀 ~ ProfileComponent ~ this.teacherService.updateTeacher ~ teacherToUpdate:", teacherToUpdate)

    this.teacherService.updateTeacher(teacherToUpdate).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Data Saved',
          detail: 'تم حفظ البيانات بنجاح ✅',
        });
        this.checkProfileData(this.teacherEmail);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'حدث خطأ أثناء التحديث ❌',
        });
      }
    });
  }

}
