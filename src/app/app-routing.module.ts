import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { guestGuard } from './core/guards/guest.guard';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', redirectTo: 'landing', pathMatch: 'full'},
    { path: 'landing', canActivate:[guestGuard], component: LandingComponent},
    { path: 'home', canActivate:[authGuard] ,component: UserHomeComponent}
  ] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
