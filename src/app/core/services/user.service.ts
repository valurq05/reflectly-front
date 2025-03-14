import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, User } from '../model/common.model';
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
}
