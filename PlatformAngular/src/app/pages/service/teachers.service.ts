import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

   private apiUrl = environment.apiUrl + 'Teacher/'; // Full API Endpoint


  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<any> {
    return this.http.get<any>(this.apiUrl+"GetAllTeachers");
  }

  getTeachersFiles(teacherID : number): Observable<any> {
    return this.http.get<any>(this.apiUrl+"GetTeachersFiles?teacherID="+teacherID);
  }

  downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.apiUrl+"DownloadFile?fileName="+fileName, {responseType: 'blob',observe: 'response'});
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'UploadFilePDF', formData);
  }


}
