import { Component, inject } from '@angular/core';
import { DarkModeService } from './core/services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reflectly_front';

  darkModeService = inject(DarkModeService);
}
