import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor() { }

  showAlert(title: string, message: string, icon: 'success' | 'error' | 'warning', confirmButtonColor: string = '#dd0034', cancelButtonColor: string = '#d33') {
    Swal.fire({
      icon: icon,
      title: title,
      text: message,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: cancelButtonColor,
      confirmButtonText: 'OK'
    });
  }
}
