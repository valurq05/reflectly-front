import { Injectable } from '@angular/core';
import { ApiResponse, EmotionalLog } from '../model/common.model';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint } from '../constants.ts/constants';

@Injectable({
  providedIn: 'root'
})
export class EmotionalLogService {

  constructor(private http: HttpClient) { }

  public updateEmotionalLog(EmotionalLog: EmotionalLog){
    return this.http.put<ApiResponse<EmotionalLog[]>>(ApiEndpoint.EmotionalLog.Update, EmotionalLog);
  }
}
