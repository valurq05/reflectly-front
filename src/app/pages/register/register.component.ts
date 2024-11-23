import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      per_document: new FormControl('', [Validators.required]),
      per_name: new FormControl('', [Validators.required]),
      per_lastname: new FormControl('', [Validators.required]),
      per_telephone: new FormControl('', [Validators.required]),
      use_mail: new FormControl('', [Validators.required, Validators.email]),
      use_password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(){

  }

}
