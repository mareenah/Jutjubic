import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { VerificationComponent } from './auth/verification/verification';
import { Home } from './features/layout/home/home/home';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify/:verificationCode', component: VerificationComponent },
  { path: '', component: Home },
];
