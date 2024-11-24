import { Component, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  AuthService = inject(AuthService);

  isLoggedIn(){
    return this.AuthService.isLoggedIn();
  }
}
