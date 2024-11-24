import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse, LoginPayLoad, RegisterPayLoad, User } from '../model/common.model';
import { ApiEndpoint, LocalStorage } from '../constants.ts/constants';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal<boolean>(false);

  constructor(
    private _http: HttpClient, private router: Router){ 
      if (this.getUserToken()) {
        this.isLoggedIn.update(() => true);
      }
    }

  register(payload: RegisterPayLoad){
    const hashedPassword = CryptoJS.SHA256(payload.usePassword).toString();
    const newPayload = {
      ...payload,
      usePassword: hashedPassword
    };
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, newPayload);
  }

  login(payload: LoginPayLoad){
    const hashedPassword = CryptoJS.SHA256(payload.pwd).toString();
    const newPayload = {
      ...payload,
      usePassword: hashedPassword
    };
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, newPayload)
    .pipe(
      map((response) =>{
        if (response && response.Token) {
          console.log(response.Token);
          localStorage.setItem(LocalStorage.token, response.Token);
          localStorage.setItem(LocalStorage.user, JSON.stringify(response.data));
          this.isLoggedIn.update(() => true);
        }
        return response;
      })
    )
  }

  getUserInfo(){
   const user = JSON.parse(localStorage.getItem('USER')!);
   console.log('User info:' + user);
   return user;
  }

  getUserToken(){
    if(typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem(LocalStorage.token);
    }
    return null;
  }

  logout(){
    localStorage.removeItem(LocalStorage.token);
    localStorage.removeItem(LocalStorage.user);
    this.isLoggedIn.update(()=>false);
    this.router.navigate(['']);
  }


}
