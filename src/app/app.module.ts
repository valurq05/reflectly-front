import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DailyLogService } from './core/services/daily-log.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderMainComponent } from './header/header-main/header-main.component';
import { HeaderProtectedComponent } from './header/header-protected/header-protected.component';
import { LayoutComponent } from './layout/layout.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { EditProfileComponent } from './pages/user-profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/user-profile/profile/profile.component';
import { authInterceptor } from './core/interceptors/auth.interceptor';


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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    DailyLogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
