import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

   private apiUrl = environment.apiUrl + 'Teacher/'; 


  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any> {
    return this.http.get<any>(this.apiUrl+"GetAllTeachers");
  }

}
