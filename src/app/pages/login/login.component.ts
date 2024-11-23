import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder){
    this.form = this.fb.group({
      use_mail: new FormControl('', [Validators.required, Validators.email]),
      use_password: new FormControl('', [Validators.required,])
    });
  }

  onSubmit(){
    if(this.form.valid){
      
    }
  }
}
