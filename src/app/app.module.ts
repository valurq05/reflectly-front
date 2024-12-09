import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CreateNoteComponent } from './pages/notes/create-note/create-note.component';
import { UpdateNoteComponent } from './pages/notes/update-note/update-note.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { EditProfileComponent } from './pages/user-profile/edit-profile/edit-profile.component';
import { ProfileComponent } from './pages/user-profile/profile/profile.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';


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
    CreateNoteComponent,
    UpdateNoteComponent

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
  bootstrap: [AppComponent]
})
export class AppModule { }
