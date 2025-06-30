import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  private apiUrl = environment.apiUrl + 'Teacher/';


  constructor(private http: HttpClient) { }

  getAllTeachers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "GetTeacherWithStudents");
  }

  getTeacherByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}GetTeacherByEmail?email=${encodeURIComponent(email)}`);
  }

  updateTeacher(teacher: any): Observable<any> {
    return this.http.post(this.apiUrl + "UpdateTeacher", { teacher: teacher });
  }

  getAllStudySubject(): Observable<any> {
    return this.http.get<any>(this.apiUrl + "GetAllStudySubject");
  }

  UploadMultipleImages(formData: FormData): Observable<string[]> {
  return this.http.post<string[]>(this.apiUrl + "UploadMultipleImages", formData);
}

}
