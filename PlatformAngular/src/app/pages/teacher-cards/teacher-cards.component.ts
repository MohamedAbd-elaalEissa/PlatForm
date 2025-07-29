import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeachersService } from '../service/teachers.service';
import { AuthService } from '../service/auth.service';
import { SignalrService } from '../service/signalr.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  subject: { subjectAR: string; subjectId: number; subject: string };
  rating: number;
  experience: number;
  students: number;
  // location: string;
  // education: string;
  brief: string;
  email: string;
  phoneNumber: string;
  displayImage: string;
  availability: 'available' | 'busy' | 'offline';
  featured: boolean;
  teacherID:any,
  subjectId:any
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-cards.component.html',
  styleUrl: './teacher-cards.component.scss'
})
export class TeachersComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  searchTerm = '';
  activeFilters: string[] = ['all'];

  stats = {
    teachers: 6,
    students: 881,
    subjects: 6
  };

 filterOptions = [
  { id: 'all', label: 'المدرسين', icon: 'fas fa-th' },
  { id: 'featured', label: 'مميز', icon: 'fas fa-star' },
  { id: 'available', label: 'متاح الان', icon: 'fas fa-check-circle' },
  { id: 'الفيزياء', label: 'الفيزياء', icon: 'fas fa-atom' },             
  { id: 'الكيمياء', label: 'الكيمياء', icon: 'fas fa-vial' },             
  { id: 'علم الأحياء', label: 'علم الأحياء', icon: 'fas fa-dna' },        
  { id: 'التاريخ', label: 'التاريخ', icon: 'fas fa-landmark' },           
  { id: 'الجغرافيا', label: 'الجغرافيا', icon: 'fas fa-globe-africa' }    
];
  filteredTeachers: Teacher[] = [];
  teachers: Teacher[] = [];
  email: any;
  private localApi = environment.localApi;
  constructor(private teachersService: TeachersService, private signalRService: SignalrService, private authService: AuthService,private router: Router) {
  }
  ngOnInit() {
    this.getAllTeachers()
    this.email = this.authService.getUserEmail();
    this.signalRService.startConnection(this.email);
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
  getAllTeachers() {
    this.teachersService.getAllTeachers().subscribe({
      next: (data) => {
        this.teachers = data.map((teacher: any) => {
          if (teacher.imagesUrl) {
            const images = teacher.imagesUrl.split('_||_');
            const randomIndex = Math.floor(Math.random() * images.length);
            const selectedImage = images[randomIndex];
            teacher.displayImage = `${this.localApi}/browser/${selectedImage}`;
          }
          else {
            teacher.displayImage = `${this.localApi}/browser/my-profile-icon-blankcircle.png`;
          }
          teacher.availability = 'available',
            teacher.featured = true,
            teacher.rating = 4.7
          return teacher;
        });
        this.filterTeachers();
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.background-decoration') as HTMLElement;
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }

  onSearch() {
    this.filterTeachers();
  }

  toggleFilter(filterId: string) {
    if (filterId === 'all') {
      this.activeFilters = ['all'];
    } else {
      const allIndex = this.activeFilters.indexOf('all');
      if (allIndex > -1) {
        this.activeFilters.splice(allIndex, 1);
      }

      const filterIndex = this.activeFilters.indexOf(filterId);
      if (filterIndex > -1) {
        this.activeFilters.splice(filterIndex, 1);
      } else {
        this.activeFilters.push(filterId);
      }

      if (this.activeFilters.length === 0) {
        this.activeFilters = ['all'];
      }
    }
    this.filterTeachers();
  }

  isFilterActive(filterId: string): boolean {
    return this.activeFilters.includes(filterId);
  }

  filterTeachers() {
    this.filteredTeachers = this.teachers.filter(teacher => {
      // Search filter
      const searchTermLower = this.searchTerm.toLowerCase();
      const searchMatch = !this.searchTerm ||
        (teacher.firstName?.toLowerCase()?.includes(searchTermLower)) ||
        (teacher.lastName?.toLowerCase()?.includes(searchTermLower)) ||
        (teacher.subject?.subjectAR?.toLowerCase()?.includes(searchTermLower));
      // Category filters
      if (this.activeFilters.includes('all')) {
        return searchMatch;
      }

      const categoryMatch = this.activeFilters.some(filter => {
        switch (filter) {
          case 'featured':
            return teacher.featured;
          case 'available':
            return teacher.availability === 'available';
          case 'الفيزياء':
            return teacher?.subject?.subjectAR.toLowerCase().includes('الفيزياء');
          case 'الكيمياء':
            return teacher?.subject?.subjectAR.toLowerCase().includes('الكيمياء');
          case 'علم الأحياء':
            return teacher?.subject?.subjectAR.toLowerCase().includes('علم الأحياء');
          case 'التاريخ':
            return teacher?.subject?.subjectAR.toLowerCase().includes('التاريخ');
          case 'الجغرافيا':
            return teacher?.subject?.subjectAR.toLowerCase().includes('الجغرافيا');
          default:
            return false;
        }
      });

      return searchMatch && categoryMatch;
    });
  }

  getStarsArray(rating: number): boolean[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.floor(rating));
    }
    return stars;
  }

  viewProfile(teacherId: string, subjectId: any) {
    sessionStorage.setItem('teacherId', teacherId);
    sessionStorage.setItem('subjectId', subjectId);
     this.router.navigate(['/pages/chaptersDashboard']);
  }

  getAvailabilityIcon(availability: string): string {
    switch (availability) {
      case 'available':
        return 'fas fa-check';
      case 'busy':
        return 'fas fa-clock';
      case 'offline':
        return 'fas fa-times';
      default:
        return 'fas fa-question';
    }
  }

  getAvailabilityClass(availability: string): string {
    return `availability-badge ${availability}`;
  }
}