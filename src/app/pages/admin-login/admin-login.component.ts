import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User, UserData } from '../../core/model/common.model';
import { AlertServiceService } from '../../core/services/alert-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
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
        next: (response: ApiResponse<UserData>) =>{
          if (response.Status) {
            console.log(response);
            document.querySelector('.modal-backdrop')?.remove();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
            modal?.hide();
            this.router.navigate(['adminhome']);
          }else{
            console.log(response)
            this.alertService.showAlert('Error', response.message || 'Hay un problema con tus credenciales', 'error');
          }
        }
    })
    }
  }

  seePassword() {
    this.showPassword = !this.showPassword;
  }

  clearForm() {
    this.form.reset();
  }
}
