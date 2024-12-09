import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse, googleResponse, LoginPayLoad, RegisterPayLoad, User} from '../model/common.model';
import { ApiEndpoint, LocalStorage } from '../constants.ts/constants';
import { BehaviorSubject, firstValueFrom, map, Observable} from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import { Auth, authState, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private accessToken: string = '';
  isLoggedIn = signal<boolean>(false);
  secretKey:string = 'TuClaveSecreta';

  constructor(private http: HttpClient, private router: Router, private _auth:Auth) {
    if (!this.getAccessToken() && this.isLoggedIn()) {
      this.verifySession();
    }
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

  public register(payload: RegisterPayLoad) {
    return this.http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload);
  }

  public login(payload: LoginPayLoad) {
    const hashedPassword = CryptoJS.SHA256(payload.pwd).toString();
    const newPayload = {
      ...payload,
      usePassword: hashedPassword,
    };
    return this.http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, newPayload, { withCredentials: true }).pipe(
      map((response) => {
        if (response && response.Token) {
          console.log('Login exitoso:', response);
          this.setAccessToken(response.Token);
          console.log("access token:" + this.getAccessToken());
          const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(response.Data), this.secretKey).toString()
          localStorage.setItem(LocalStorage.user, encryptedUser);
          this.isLoggedIn.update(() => true);
        }
        return response;
      })
    );
  }

  public authState$():Observable<any>{
    return authState(this._auth);
  }

  public googleLogin(){
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }

  public getRefreshToken() {
    return this.http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Refresh}`, null)
  }

  public logout(){
    localStorage.removeItem(LocalStorage.token);
    localStorage.removeItem(LocalStorage.user);
    this.isLoggedIn.update(()=>false);
    this.router.navigate(['']);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken() {
    console.log(this.accessToken);
    return this.accessToken;
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
