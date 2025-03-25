import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './pages/landing/landing.component';
import { CreateNoteComponent } from './pages/notes/create-note/create-note.component';
import { NotesComponent } from './pages/notes/notes/notes.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminRegisterComponent } from './pages/admin-register/admin-register.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { PaymentComponent } from './pages/payment/payment.component';

const routes: Routes = [
  {
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', redirectTo: 'landing', pathMatch: 'full'},
    { path: 'landing', canActivate:[guestGuard], component: LandingComponent},
    { path: 'home', canActivate:[authGuard] ,component: UserHomeComponent},
    { path: 'create', canActivate:[authGuard] ,component: CreateNoteComponent},
    { path: 'notes', canActivate:[authGuard] ,component: NotesComponent},
    { path: 'notes/:id',canActivate: [authGuard],  component: CreateNoteComponent},
    { path: 'admlogin', canActivate: [guestGuard],  component: AdminLoginComponent},
    { path: 'admregister', canActivate: [guestGuard],  component: AdminRegisterComponent},
    { path: 'adminhome', canActivate:[authGuard], component: AdminHomeComponent},
    { path: 'subscription', canActivate:[authGuard], component: SubscriptionComponent},
    { path: 'payment', canActivate:[authGuard], component: PaymentComponent}
  ] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
