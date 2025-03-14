import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiResponse, LoginPayLoad, RegisterPayLoad, User} from '../model/common.model';
import { ApiEndpoint, LocalStorage } from '../constants.ts/constants';
import { BehaviorSubject, firstValueFrom, map, Observable} from 'rxjs';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Auth, authState, browserLocalPersistence, GoogleAuthProvider, setPersistence, signInWithPopup } from '@angular/fire/auth';

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

  async verifySession(): Promise<void> {
    try {
     
      const firebaseUser = await firstValueFrom(this.authState$());
      if (firebaseUser) {
          this.setAccessToken(firebaseUser.stsTokenManager.accessToken);
          this.isLoggedIn.update(() => true);
          return;
      }
      const response = await firstValueFrom(this.getRefreshToken());
      if (response && response.NewAccessToken) {
        this.setAccessToken(response.NewAccessToken);
        this.isLoggedIn.update(() => true);
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
          localStorage.setItem(LocalStorage.rol, JSON.stringify(response.Data));
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

  public userExist(email: string) {
    let params = new HttpParams().set('email', email);

    return this.http.get<boolean>(`${ApiEndpoint.Auth.UserExist}`, {
        params: params,
    });
}

  public getRefreshToken() {
    return this.http.post<ApiResponse<User>>(`${ApiEndpoint.Auth.Refresh}`, null)
  }

  setAccessToken(token:string) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  public async logout() {
    try {
      await this._auth.signOut();

      this.setAccessToken('');
      localStorage.removeItem(LocalStorage.user);
      localStorage.removeItem(LocalStorage.rol);

      this.isLoggedIn.update(() => false);

      this.router.navigate(['']);
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
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
