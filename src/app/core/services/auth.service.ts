import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse, LoginPayLoad, RegisterPayLoad, User} from '../model/common.model';
import { ApiEndpoint, LocalStorage} from '../constants.ts/constants';
import { firstValueFrom, map} from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal<boolean>(false);

  constructor(private _http: HttpClient, private router: Router) {
    if(this.getUserToken()){
      this.isLoggedIn.update(() => true);
    }
  }

  getRefreshToken() {
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Refresh}`, null);
  }

  register(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload);
  }

  login(payload: LoginPayLoad) {
    const hashedPassword = CryptoJS.SHA256(payload.pwd).toString();
    const newPayload = {
      ...payload,
      usePassword: hashedPassword,
    };
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, newPayload, { withCredentials: true }).pipe(
      map((response) => {
        if (response && response.Token) {
          console.log('Login exitoso:', response);
          localStorage.setItem(LocalStorage.token, response.Token);
          localStorage.setItem(LocalStorage.user, JSON.stringify(response.Data));
          // this.setAccessToken(response.Token);
          // console.log("access token:" + this.getAccessToken());
          this.isLoggedIn.update(() => true);
        }
        return response;
      })
    );
  }

  logout(){
    localStorage.removeItem(LocalStorage.token);
    localStorage.removeItem(LocalStorage.user);
    this.isLoggedIn.update(()=>false);
    this.router.navigate(['']);
  }

  // setAccessToken(token: string) {
  //   this.accessToken = token;
  // }

  // getAccessToken() {
  //   return this.accessToken;
  // }

  getUserToken(){
    if(typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem(LocalStorage.token);
    }
    return null;
  }

  getUserInfo(){
    const user = JSON.parse(localStorage.getItem('USER')!);
    console.log('User info:' + user);
    return user;
   }

}
