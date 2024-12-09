import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../core/model/common.model';
import { AlertServiceService } from '../../core/services/alert-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form!: FormGroup;
  showPassword:boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private alertService: AlertServiceService){
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

  seePassword() {
    this.showPassword = !this.showPassword;
  }

  clearForm() {
    this.form.reset();
  }

  googleSignUp(){
    this.authService.googleLogin();
    this.authState();
  }

  authState(){
    this.authService.authState$().subscribe({
      next: (response) => {
        console.log(response);
      }
    })
  }

}
