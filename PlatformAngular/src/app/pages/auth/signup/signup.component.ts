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
import { RegisterModel } from '../../models/models';
import { AuthService } from '../../service/auth.service';

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
    // AppFloatingConfigurator,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [MessageService],
})
export class SignupComponent {
  constructor(private messageService: MessageService, private authService: AuthService, private router: Router) { }
  registerModel: RegisterModel = {
    userName: '',
    email: '',
    phoneNumber: '',
    password: ''
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

    // Simulate success


    console.log(this.registerModel)

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
      error: (err) => {
        debugger
        this.messageService.add({
          severity: 'error',
          summary: 'Register',
          detail: err.error.message,
        });
      }
    });
  }

}
