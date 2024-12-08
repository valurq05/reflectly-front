import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../core/model/common.model';
import { AlertServiceService } from '../../core/services/alert-service.service';
import { LocalStorage } from '../../core/constants.ts/constants';

declare var bootstrap:any; 
declare var google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  form!: FormGroup;
  showPassword:boolean = false;
  secretKey:string = 'TuClaveSecreta';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertServiceService){
    this.validateForm();
  }

  ngOnInit(): void {
      google.accounts.id.initialize({
        client_id: '923394514576-8085b0tcvb6a06cucea08lm9v06go3qi.apps.googleusercontent.com',
        callback: (res:any) => this.handleGoogleLogin(res)
      });

      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: 'outline',
        size: 'large',
        shape: 'rectangle',
        width: 350
      });
  }

  validateForm(){
    const emailRgx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRgx = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%,._;:*#?&])[A-Za-z\d@$!%.,;:_*#?&]{8,20}$/;

    this.form = this.fb.group({
      user: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRgx)]),
      pwd: new FormControl('', [Validators.required, Validators.pattern(passwordRgx), Validators.minLength(8), Validators.maxLength(20)])
    });
  }

  onSubmit(){
    if(this.form.valid){
      console.log(this.form.value);
      this.authService.login(this.form.value).subscribe({
        next: (response: ApiResponse<User>) =>{
          if (response.Status) {
            console.log(response);
            document.querySelector('.modal-backdrop')?.remove();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
            modal?.hide();
            this.router.navigate(['home']);
          }else{
            console.log(response)
            this.alertService.showAlert('Error', response.message || 'Hay un problema con tus credenciales', 'error');
          }
        }
    })
    }
  }

  private decodeToken(token:string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleGoogleLogin(response:any){
    if (response) {
      console.log(response)
    // const payload = this.decodeToken(response.credential);
    // localStorage.setItem(LocalStorage.user, JSON.stringify(payload));
    // document.querySelector('.modal-backdrop')?.remove();
    // const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
    // modal?.hide();
    // this.router.navigate(['home']);
    } else {
    console.log(response)
    this.alertService.showAlert('Error', response.message || 'Hay un problema con tus credenciales', 'error');
    }
  }

  seePassword() {
    this.showPassword = !this.showPassword;
  }

  clearForm() {
    this.form.reset();
  }

}
