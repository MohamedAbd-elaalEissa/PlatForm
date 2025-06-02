import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, retry, throwError, timeout, timer } from 'rxjs';
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

  // uploadFileChunk(formData: FormData): Observable<any> {
  //   return this.http.post(this.apiUrl + 'UploadFileChunk', formData);
  // }
  // uploadFileChunk(formData: FormData, timeoutMs: number = 4*3600000): Observable<any> {
  //   const headers = new HttpHeaders({
  //     // Don't set Content-Type header when using FormData
  //     // The browser will set it automatically with the boundary
  //   });

  //   const options = {
  //     headers: headers,
  //     reportProgress: true, // Enable progress reporting if needed
  //     observe: 'body' as const,
  //     // Note: Angular HttpClient doesn't have a direct timeout option
  //     // We'll use the RxJS timeout operator in the pipe
  //   };

  //   return this.http.post<any>(this.apiUrl + 'UploadFileChunk', formData, options)
  //     .pipe(
  //       timeout(timeoutMs), // Apply timeout using RxJS operator
  //       catchError(this.handleError)
  //     );
  // }

uploadFileChunk(chunkData: FormData, onProgress?: (progress: number) => void): Observable<any> {
  const headers = new HttpHeaders();
  
  // Create HTTP request with progress reporting
  const req = new HttpRequest('POST', `${this.apiUrl}UploadFileChunk`, chunkData, {
    headers: headers,
    reportProgress: true,
  });

  return this.http.request(req).pipe(
    timeout(1800000), // 30 minutes timeout
    map((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        const progress = Math.round((event.loaded / event.total) * 100);
        if (onProgress) {
          onProgress(progress);
        }
        return { type: 'progress', progress };
      } else if (event.type === HttpEventType.Response) {
        return event.body;
      }
      return event;
    }),
    retry({
      count: 3,
      delay: (error, retryCount) => {
        console.log(`Upload attempt ${retryCount} failed:`, error);
        // Exponential backoff: 2s, 4s, 8s
        return timer(Math.pow(2, retryCount) * 1000);
      },
      resetOnSuccess: true
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Upload Error:', error);
      
      if (error.status === 503) {
        return throwError(() => new Error('Server timeout. Please try uploading with smaller chunk size or check your internet connection.'));
      } else if (error.status === 0) {
        return throwError(() => new Error('Network error. Please check your internet connection and try again.'));
      } else if (error.status === 408) {
        return throwError(() => new Error('Upload timeout. The upload took too long to complete.'));
      } else {
        return throwError(() => new Error(`Upload failed: ${error.message || 'Unknown error'}`));
      }
    })
  );
}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} ${error.message}`;
    }

    console.error('Upload Error:', errorMessage, error);
    return throwError(() => error);
  }
  getTeachersVideos(Obj: TeachersVideosDataModel): Observable<any> {
    return this.http.post(this.apiUrl + "GetTeachersVideos", Obj);
  }

  checkUploadedChunks(userId: number, fileName: string): Observable<any> {
    return this.http.get(this.apiUrl + "CheckUploadedChunks?userId=" + userId + "&" + "fileName=" + fileName);
  }

  getVideoFile(fileName: string): Observable<any> {
    return this.http.get(this.apiUrl + "GetVideoFile?fileName=" + fileName);
  }

}
