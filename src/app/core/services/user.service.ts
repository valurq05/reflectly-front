import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, chatBotPayLoad, DailyLog, User } from '../model/common.model';
import { ApiEndpoint } from '../constants.ts/constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  public GetAllUsers(){
    return this.http.get<ApiResponse<User[]>>(ApiEndpoint.User.GetAll)
  }

  public readAllEntries(userId: string){
    let params = new HttpParams().set('userId', userId);

    return this.http.get<ApiResponse<string>>(ApiEndpoint.Entry.AllEntries,{
      params: params,
    })
  }

  public askChatBot(payload: chatBotPayLoad){
    return this.http.post<string>(`${ApiEndpoint.Bot.Question}`, payload);
  }
}
