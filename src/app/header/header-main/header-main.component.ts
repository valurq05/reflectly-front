import { Component, inject } from '@angular/core';
import { DarkModeService } from '../../core/services/dark-mode.service';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.css'
})
export class HeaderMainComponent {

  darkModeService = inject(DarkModeService);

  toggleDarkMode(){
    this.darkModeService.updateDarkMode();
  }
}
