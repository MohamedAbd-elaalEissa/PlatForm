import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StudentAnswerFilterModel, TeacherFileModel, TeachersVideosDataModel } from '../models/models';



@Injectable({
  providedIn: 'root'
})
export class TasksAndVideosService {

  private apiUrl = environment.apiUrl + 'File/'; 
  constructor(private http: HttpClient) { }

  getTeachersFiles(Obj: TeacherFileModel): Observable<any> {
    
    return this.http.post(this.apiUrl + "GetTeachersFiles", Obj);
  }

  downloadFile(fileName: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.apiUrl + "DownloadFile?fileName=" + fileName, { responseType: 'blob', observe: 'response' });
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'UploadFilePDF', formData);
  }

  getStudentAnswer(Obj: StudentAnswerFilterModel): Observable<any> {

    return this.http.post(this.apiUrl + "GetStudentAnswer", Obj);
  }

  getAllAcademicLevels(): Observable<any> {
    return this.http.get(this.apiUrl + "getAllAcademicLevels");
  }

  uploadFileChunk(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + 'UploadFileChunk', formData);
  }

  getTeachersVideos(Obj: TeachersVideosDataModel): Observable<any> {
    return this.http.post(this.apiUrl + "GetTeachersVideos", Obj);
  }

  checkUploadedChunks(userId: number, fileName: string): Observable<any> {
    return this.http.get(this.apiUrl + "CheckUploadedChunks?userId=" + userId + "&" + "fileName=" + fileName);
  }

  getVideoFile(fileName: string): Observable<any> {
    return this.http.get(this.apiUrl + "GetVideoFile?fileName=" + fileName, { responseType: 'blob' });
  }

}
