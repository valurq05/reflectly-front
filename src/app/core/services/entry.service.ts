import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, EmotionalState, Entry } from '../model/common.model';
import { ApiEndpoint } from '../constants.ts/constants';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(private http: HttpClient) {

  }
    public updateEntry(Entry: Entry){
      return this.http.put<ApiResponse<Entry[]>>(ApiEndpoint.Entry.Update, Entry);
    }
  
}
