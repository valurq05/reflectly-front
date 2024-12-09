import { Component, Inject, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { DarkModeService } from '../../core/services/dark-mode.service';

@Component({
  selector: 'app-header-protected',
  templateUrl: './header-protected.component.html',
  styleUrl: './header-protected.component.css'
})
export class HeaderProtectedComponent {

  darkModeService = inject(DarkModeService);
  authService = inject(AuthService);

  Logout(){
    this.authService.logout();
  }

  toggleDarkMode(){
    this.darkModeService.updateDarkMode();
  }
}
