import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  darkModeSignal = signal<string>('null');

 updateDarkMode() {
  this.darkModeSignal.update((value) => {
    const newValue = value === 'dark' ? 'light' : 'dark';
    console.log('Nuevo valor del tema:', newValue);
    return newValue;
  });
  }

  constructor() { }
}
