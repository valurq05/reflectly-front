import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { AlertServiceService } from '../../../core/services/alert-service.service';
import { User } from '../../../core/model/common.model';
import { LocalStorage } from '../../../core/constants.ts/constants';
import { firstValueFrom, map } from 'rxjs';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.css'
})
export class GoogleAuthComponent {

  secretKey:string = 'TuClaveSecreta';

  constructor( 
    private authService: AuthService,
    private alertService: AlertServiceService, 
    private router: Router){
  }

  async googleSignUp() {
    try {
        const googleAuth = await this.authService.googleLogin();
        if (googleAuth) {
            this.authService.authState$().subscribe(async (user) => {
                if (user) {
                    console.log('Usuario autenticado:', user);
                    const tokenJWT = await user.getIdToken();

                    const decodedUser = this.decodeToken(tokenJWT);
                    
                    const isRegistered = await firstValueFrom(this.authService.userExist(user.email));
                    if (!isRegistered) {
                        
                        const newUser: User = {
                            useId: 0,
                            useMail: user.email!,
                            usePassword: "Mvalurqcito005__",
                            person: {
                                perId: 0,
                                perDocument: decodedUser.person.perDocument,
                                perName: decodedUser.person.perName,
                                perLastname: decodedUser.person.perLastname,
                                perPhoto: decodedUser.person.perPhoto,
                            },
                        };

                        this.authService.register(newUser).subscribe({
                            next: (response) => {
                                console.log('Usuario registrado exitosamente:', response);
                                
                                newUser.useId = response.Data.useId;
                                const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(newUser), this.secretKey).toString();
                                localStorage.setItem(LocalStorage.user, encryptedUser);

                                this.authService.setAccessToken(user.stsTokenManager.accessToken);

                                document.querySelector('.modal-backdrop')?.remove();
                                const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegister'));
                                modal?.hide();

                                this.router.navigate(['home']);
                            },
                            error: (err) => {
                                console.error('Error al registrar el usuario:', err);
                            },
                        });
                    } else {
                        console.log('Usuario ya registrado, iniciando sesión...');

                        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(decodedUser), this.secretKey).toString();
                        localStorage.setItem(LocalStorage.user, encryptedUser);

                        this.authService.setAccessToken(user.stsTokenManager.accessToken);

                        document.querySelector('.modal-backdrop')?.remove();
                        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegister'));
                        modal?.hide();

                        this.router.navigate(['home']);
                        this.authService.isLoggedIn.update(() => true);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error en googleSignUp:', error);
    }
  }


  private decodeToken(token: string): User {
    const tokenDecodified = JSON.parse(atob(token.split(".")[1]));
    
    const fullName = tokenDecodified.name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts.slice(0, -1).join(' ') || 'Slay';
    const lastName = nameParts[nameParts.length - 1] || 'Camargo';

    return {
        useId: 0,
        useMail: tokenDecodified.email,
        usePassword: 'Mvalurq005__',
        person: {
            perId: 0,
            perDocument: '10799706540',
            perName: firstName,
            perLastname: lastName,
            perPhoto: tokenDecodified.picture,
        },
    };
  }

}
