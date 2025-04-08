import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


export interface StudentAnswerFilterModel 
  {
      teacherId : number ,
      filesId: number ,
      studentId?: number ,
      AnswerName? :string,
      StudentName? :string,
      AcademicLevelName? :string,
      FileAnswersID?: number ,
      AcademicLevelId?: number ,
      pageNumber: number ,
      pageSize: number ,
    }

@Injectable({
  providedIn: 'root'
})
export class TasksAndVideosService {

   private apiUrl = environment.apiUrl + 'File/'; // Full API Endpoint


  constructor(private http: HttpClient) {}

  getTeachersFiles( Obj: any ): Observable<any> {
    return this.http.post(this.apiUrl+"GetTeachersFiles", Obj );
  }

  downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.apiUrl+"DownloadFile?fileName="+fileName, {responseType: 'blob',observe: 'response'});
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'UploadFilePDF', formData);
  }

  getStudentAnswer( Obj: StudentAnswerFilterModel ): Observable<any> {
    
    return this.http.post(this.apiUrl+"GetStudentAnswer", Obj );
  }


}
