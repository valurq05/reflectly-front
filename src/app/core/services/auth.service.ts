import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse, LoginPayLoad, RegisterPayLoad, User} from '../model/common.model';
import { ApiEndpoint, LocalStorage } from '../constants.ts/constants';
import { map} from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal<boolean>(false);
  secretKey:string = 'TuClaveSecreta';

  constructor(private _http: HttpClient, private router: Router) {

    if(this.getUserToken()){
      this.isLoggedIn.update(() => true);
    }
    
  }

  public getRefreshToken() {
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Refresh}`, null);
  }

  public register(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload);
  }

  public login(payload: LoginPayLoad) {
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
          const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(response.Data), this.secretKey).toString()
          localStorage.setItem(LocalStorage.user, encryptedUser);
          // this.setAccessToken(response.Token);
          // console.log("access token:" + this.getAccessToken());
          this.isLoggedIn.update(() => true);
        }
        return response;
      })
    );
  }

  public logout(){
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

  public getUserToken(){
    if(typeof window !== 'undefined' && typeof localStorage !== 'undefined'){
      return localStorage.getItem(LocalStorage.token);
    }
    return null;
  }

  public getUserInfo(){
    const encryptedUser = localStorage.getItem(LocalStorage.user);
    if (!encryptedUser) {
    console.log("no se encontraron datos del usuario");
    return null;
    }else{
      const bytes = CryptoJS.AES.decrypt(encryptedUser, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      const userInfo = JSON.parse(decryptedData);
      return userInfo;
    }
   }

}
