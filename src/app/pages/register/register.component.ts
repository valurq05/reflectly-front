import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../core/model/common.model';
import { AlertServiceService } from '../../core/services/alert-service.service';
import { firstValueFrom, map } from 'rxjs';
import { user } from '@angular/fire/auth';
import { LocalStorage } from '../../core/constants.ts/constants';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form!: FormGroup;
  showPassword:boolean = false;
  secretKey:string = 'TuClaveSecreta';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private alertService: AlertServiceService,
    private router: Router){
      this.validateForm()
  }

  validateForm(){
      const docRgx = /^\d+$/;
      const nameRgx = /^(([a-zA-ZÀ-ÖØ-öø-ÿ]{3,60})([\s]?)([a-zA-ZÀ-ÖØ-öø-ÿ]*))$/;
      const emailRgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordRgx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%,._;:*#?&])[A-Za-z\d@$!%.,;:_*#?&]{8,20}$/;

      this.form = this.fb.group({
      useMail: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRgx)]),
      usePassword: new FormControl('', [Validators.required, Validators.pattern(passwordRgx), Validators.minLength(8), Validators.maxLength(20)]),
      person: this.fb.group({
        perDocument: new FormControl('', [Validators.required, Validators.pattern(docRgx), Validators.minLength(6), Validators.maxLength(12)]),
        perName: new FormControl('', [Validators.required, Validators.pattern(nameRgx)]),
        perLastname: new FormControl('', [Validators.required, Validators.pattern(nameRgx)])
      })
    });
  }

  onSubmit(){
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.register(this.form.value).subscribe({
        next: (response: ApiResponse<User>) => {
          console.log(response);
          if (response.Status) {
            this.alertService.showAlert('', response.message || 'Te has registrado correctamente', 'success');
          } else if(!response.Status) {
            this.alertService.showAlert('Error', response.message || 'Ha ocurrido un error', 'error');
          }
        }
      })
    }
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

  seePassword() {
    this.showPassword = !this.showPassword;
  }

  clearForm() {
    this.form.reset();
  }

}
