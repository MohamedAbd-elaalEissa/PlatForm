import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { academicLevelDataModel, RegisterModel, StudySubject } from '../../models/models';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ErrorHandlerService } from '../../service/error-handler.service';
import { TeachersService } from '../../service/teachers.service';
import { TasksAndVideosService } from '../../service/tasks-and-videos.service';
import { DropdownModule } from 'primeng/dropdown';
import { IncludesRolePipe } from '../../Pipe/includes-role.pipe';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ToastModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RouterModule,
    RippleModule,
    CommonModule,
    DropdownModule,
    IncludesRolePipe,
    FloatLabelModule
    // AppFloatingConfigurator,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [MessageService],
})
export class SignupComponent {
  userRoles: any;
  errorMessage: any;
  SubjectData: StudySubject[] = [];
  academicLevelData: academicLevelDataModel[] = [];
  roles: any;
  academicId: any
  constructor(private messageService: MessageService, private tasksAndVideos: TasksAndVideosService, private authService: AuthService, private router: Router, private errorHandler: ErrorHandlerService) {
    var token = localStorage.getItem('token');
    if (token != null) {
      var email = this.authService.getUserEmail();
      this.GetUserRoles(email);
      this.roles = this.authService.getUserTokenRoles();
      const rolesArray = Array.isArray(this.roles) ? this.roles : [this.roles];
      // if (rolesArray.some(role => role.includes('Student'))) {
      // }

    }
    this.getAcademicLevelFilter();

  }
  registerModel: RegisterModel = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    isTeacher: false
  }; confirmPassword: string = '';

  register() {
    if (
      !this.registerModel.email ||
      !this.registerModel.userName ||
      !this.registerModel.phoneNumber ||
      !this.registerModel.password ||
      !this.confirmPassword
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields',
      });
      return;
    }

    if (!this.registerModel.email.includes('@')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email is not valid',
      });
      return;
    }

    if (this.registerModel.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match',
      });
      return;
    }
    this.authService.Register({ register: this.registerModel }).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Register',
          detail: 'Registered Successfully',
        });
        console.log(data)
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (error: ErrorResponse) => {
        this.errorHandler.handleError(error).subscribe({
          error: (err) => {
            this.errorMessage = err.userMessage;
          }
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Register',
          detail: this.errorMessage,
        });
      }
    });
  }

  GetUserRoles(email: string) {
    this.authService.GetUserRoles(email).subscribe((res) => {
      this.userRoles = res;
    })
  }


  getAcademicLevelFilter() {
    this.tasksAndVideos.getAllAcademicLevels().subscribe({
      next: (data) => {
        this.academicLevelData = data
        //console.log('this.academicLevelData',this.academicLevelData)
      }
    });
  }
  onAcademicLevelChange(event: any) {
    // console.log('Selected value:', event.value);
    // console.log('Academic ID:', this.registerModel.academicLevelId);
    // console.log('Available options:', this.academicLevelData);
  }
}
