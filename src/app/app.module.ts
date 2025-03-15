import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { FooterComponent } from './footer/footer.component';
import { HeaderMainComponent } from './header/header-main/header-main.component';
import { HeaderProtectedComponent } from './header/header-protected/header-protected.component';
import { LayoutComponent } from './layout/layout.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { NotesModule } from './pages/notes/notes.module';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { EditProfileComponent } from './pages/user-profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/user-profile/profile/profile.component';
import { GoogleAuthComponent } from './pages/google/google-auth/google-auth.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { AdminRegisterComponent } from './pages/admin-register/admin-register.component';
import { AdminPatientsComponent } from './pages/admin-patients/admin-patients.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
//register swiper
register();

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
    GoogleAuthComponent,
    AdminLoginComponent,
    AdminRegisterComponent,
    AdminPatientsComponent,
    AdminHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NotesModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideFirebaseApp(() => initializeApp({
      "projectId":"reflectly-517a2",
      "appId":"1:105390829842:web:bf32ba5343d09d678203cb",
      "storageBucket":"reflectly-517a2.firebasestorage.app",
      "apiKey":"AIzaSyBhKSKQLY4_-7dzaVoaPmaCLQOy0LhjniE",
      "authDomain":"reflectly-517a2.firebaseapp.com",
      "messagingSenderId":"105390829842",
      "measurementId":"G-30MY1P5782"
    })),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
