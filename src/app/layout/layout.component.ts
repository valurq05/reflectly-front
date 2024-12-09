import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { DarkModeService } from '../core/services/dark-mode.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent{

  AuthService = inject(AuthService);
  darkModeService = inject(DarkModeService);

  isLoggedIn(){
    return this.AuthService.isLoggedIn();
  }


}
