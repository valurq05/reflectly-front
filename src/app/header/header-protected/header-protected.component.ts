import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header-protected',
  templateUrl: './header-protected.component.html',
  styleUrl: './header-protected.component.css'
})
export class HeaderProtectedComponent {

  authService = inject(AuthService);

  Logout(){
    this.authService.logout();
  }
}
