import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../core/model/common.model';

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
    private authService: AuthService){
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
          console.log(response);
          if (response.status) {
            document.querySelector('.modal-backdrop')?.remove();
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalLogin'));
            modal?.hide();
            this.router.navigate(['home']);
          }else{
            console.log(response);
          }
        }
    })
    }
  }

  seePassword() {
    this.showPassword = !this.showPassword;
  }



}
