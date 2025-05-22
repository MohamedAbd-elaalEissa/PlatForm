import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
@Component({
  selector: 'app-profile',
  imports: [ButtonModule, FormsModule, AvatarModule, SelectModule,InputTextModule,TextareaModule,InputNumberModule,InputMaskModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profile = {
    FirstName: '',
    LastName: '',
    Brief: '',
    Age: '',
    PhoneNumber: '',
    StudySubject: '',
    ImagesUrl: '',
    Email: ''
  };
  cities = [
    { name: 'عربي', code: 'NY' },
    { name: 'انجليزي', code: 'RM' },
    { name: 'كميا ', code: 'LDN' },
    { name: 'فيزيا', code: 'IST' },
    { name: 'احياء', code: 'PRS' }
  ];

  onUpdateImage() {
    // هتضيف هنا لوجيك رفع الصورة
  }

  onCancel() {
    // رجّع القيم الأصلية أو روح لراوت تاني
  }

  onSaveChanges() {
    // احفظ التعديلات أو ابعتها للسيرفر
    console.log('Saving profile:', this.profile);
  }
}
