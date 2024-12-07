import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { DailyLogService } from './core/services/daily-log.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderMainComponent } from './header/header-main/header-main.component';
import { HeaderProtectedComponent } from './header/header-protected/header-protected.component';
import { LayoutComponent } from './layout/layout.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateNoteComponent } from './pages/notes/create-note/create-note.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { EditProfileComponent } from './pages/user-profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/user-profile/profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderMainComponent,
    HeaderProtectedComponent,
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    UserHomeComponent,
    CalendarComponent,
    ProfileComponent,
    EditProfileComponent,
    CreateNoteComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
