import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrl + 'Student/';
  constructor(private http: HttpClient) { }
  GetStudentWithEmail(email:string): Observable<any> {
    return this.http.get(this.apiUrl + "GetStudentWithEmail?email="+email);
  }
}
