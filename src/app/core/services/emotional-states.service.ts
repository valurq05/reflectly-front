import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, EmotionalState } from '../model/common.model';
import { ApiEndpoint } from '../constants.ts/constants';

@Injectable({
  providedIn: 'root'
})
export class EmotionalStatesService {

  constructor(private http: HttpClient) {

   }
public getAllEmotionalState(){
  return this.http.get<ApiResponse<EmotionalState[]>>(ApiEndpoint.EmotionalState.getAll)
}
}
