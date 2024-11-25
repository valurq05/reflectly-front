import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../core/model/common.model';
import { AlertServiceService } from '../../core/services/alert-service.service';

declare var bootstrap: any; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  showPassword:boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertServiceService){
    this.form = this.fb.group({
      user: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormControl('', [Validators.required,])
    });
  }

  onSubmit(){
    if(this.form.valid){
      console.log(this.form.value);
      this.authService.login(this.form.value).subscribe({
        next: (response: ApiResponse<User>) =>{
          if (response.Status) {
            document.querySelector('.modal-backdrop')?.remove();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
            modal?.hide();
            this.router.navigate(['home']);
          }else{
            this.alertService.showAlert('Error', response.message || 'Hay un problema con tus credenciales', 'error');
          }
        }
    })
    }
  }

  seePassword() {
    this.showPassword = !this.showPassword;
  }



}
