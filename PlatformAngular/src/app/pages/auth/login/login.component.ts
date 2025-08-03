import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { LogInModel } from '../../models/models';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../service/auth.service';
import { ToastModule } from 'primeng/toast';
import { ErrorResponse } from '../../models/ErrorResponse';
import { ErrorHandlerService } from '../../service/error-handler.service';
import { TeachersService } from '../../service/teachers.service';
@Component({
  selector: 'app-login',
  imports: [ToastModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class LoginComponent {
  logInModel: LogInModel = {
    email: "",
    password: ""
  }
  email: string = '';
  password: string = '';
  checked: boolean = false;
  errorMessage: any;
  roles: any;
  constructor(private messageService: MessageService, private teachersService: TeachersService, private authService: AuthService, private router: Router, private errorHandler: ErrorHandlerService) {
  }

  async signIn() {
    if (!this.logInModel.email || !this.logInModel.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all fields',
      });
      return;
    }
    if (!this.logInModel.email.includes('@')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email is not valid',
      });
      return;
    }

    this.authService.signIn({ Login: this.logInModel }).subscribe({
      next: async (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Login',
          detail: 'Login Successfully',
        });

        setTimeout(async () => {
          this.roles = this.authService.getUserTokenRoles();
          if (!this.roles) {
            this.router.navigate(['/notfound']);
          }
          const rolesArray = Array.isArray(this.roles) ? this.roles : [this.roles];
          if (rolesArray.some(role => role.includes('Teacher'))) {
            const teacherData = await this.teachersService.getTeacherByEmail(this.logInModel.email).toPromise();
            const isComplete =
              teacherData.age !== 0 &&
              teacherData.education && teacherData.education.trim() !== "" &&
              teacherData.imagesUrl && teacherData.imagesUrl.trim() !== "" &&
              teacherData.subjectId !== null;

            if (isComplete) {
              this.router.navigate(['/pages/teachers']);
            } else {
              localStorage.setItem('teacherProfile', JSON.stringify(teacherData));
              this.router.navigate(['/profile']);
            }
          }
          else {
            this.router.navigate(['/pages/teachers']);
          }
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
          summary: 'Login',
          detail: this.errorMessage,
        });
      }
    });
  }

  checkProfileData(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.teachersService.getTeacherByEmail(email).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: () => {
          resolve(false);
        }
      });
    });
  }
}
