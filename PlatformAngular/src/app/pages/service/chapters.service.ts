import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChapterModel, ChapterUpdateModel } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChaptersService {

  private apiUrl = environment.apiUrl + 'Chapter/';
  constructor(private http: HttpClient) { }

  getAllChapters(Obj: ChapterModel): Observable<any> {
    return this.http.post(this.apiUrl + "GetAllChapters", Obj);
  }

  deleteChapter(id: number): Observable<any> {
    return this.http.get(this.apiUrl + "DeleteChapter?id="+id);
  }

  updateChapter(chapter: ChapterUpdateModel): Observable<any> {
    console.log("🚀 ~ ChaptersService ~ updateChapter ~ Obj:", chapter)
    return this.http.post(this.apiUrl + "UpdateChapter", chapter);
  }

  createChapter(payload: { chapter: ChapterModel }): Observable<any> {
    console.log("🚀 ~ ChaptersService ~ createChapter ~ createChapter:", payload)
    return this.http.post(this.apiUrl + "CreateChapter", payload);
  }


}
