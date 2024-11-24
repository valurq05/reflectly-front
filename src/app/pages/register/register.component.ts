import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiResponse, User } from '../../core/model/common.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;
  showPassword:boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.form = this.fb.group({
      useMail: new FormControl('', [Validators.required, Validators.email]),
      usePassword: new FormControl('', [Validators.required]),
      person: this.fb.group({
        perDocument: new FormControl('', [Validators.required]),
        perName: new FormControl('', [Validators.required]),
        perLastname: new FormControl('', [Validators.required]),
        perPhoto: new FormControl('ksdjskf')
      })
    });
    
  }

  onSubmit(){
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.register(this.form.value).subscribe({
        next: (response: ApiResponse<User>) => {
          console.log(response);
          if (response.status) {
          console.log("yay");
          } else {
           console.log("D:")
          }
        }
      })
    }
  }

  seePassword() {
    this.showPassword = !this.showPassword;
  }

}
