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

  private accessToken: string = '';
  isLoggedIn = signal<boolean>(false);

  constructor(private _http: HttpClient, private router: Router) {
    this.verifySession();
  }

  async verifySession() {
    try {
      const response = await firstValueFrom(this.getRefreshToken());
      if (response && response.NewAccessToken) {
        this.setAccessToken(response.NewAccessToken);
        this.isLoggedIn.update(() => true);
        console.log("refresh auth");
      } else {
        this.logout();
      }
    } catch (error) {
      this.logout();
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
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, newPayload).pipe(
      map((response) => {
        if (response && response.Token) {
          console.log('Login exitoso:', response);
          localStorage.setItem(LocalStorage.user, JSON.stringify(response.Data));
          this.setAccessToken(response.Token);
          console.log("access token:" + this.getAccessToken());
          this.isLoggedIn.update(() => true);
        }
        return response;
      })
    );
  }

  logout() {
    this.setAccessToken('');
    this.isLoggedIn.update(() => false);
    this.router.navigate(['']);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getUserInfo(){
    const user = JSON.parse(localStorage.getItem('USER')!);
    console.log('User info:' + user);
    return user;
   }

}
