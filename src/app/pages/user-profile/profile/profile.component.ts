import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/model/common.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: User | null = null;

constructor(private authService: AuthService) {}

ngOnInit() {
  this.user = this.authService.getUserInfo();
  console.log(this.user);
}

}
