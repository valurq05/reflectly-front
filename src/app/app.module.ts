import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMainComponent } from './header/header-main/header-main.component';
import { HeaderProtectedComponent } from './header/header-protected/header-protected.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LandingComponent } from './pages/landing/landing.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ProfileComponent } from './pages/profile/profile.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { DailyLogService } from './core/services/daily-log.service';


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
    ProfileComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withFetch()),
    DailyLogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
