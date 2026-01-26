import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { VerificationComponent } from './auth/verification/verification';
import { Home } from './features/layout/home/home/home';
import { PostDisplayComponent } from './features/stakeholder/post-display/post-display';
import { ProfileComponent } from './features/stakeholder/profile/profile';
import { guestGuard } from './auth/guest.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'verify/:verificationCode', component: VerificationComponent },
  { path: '', component: Home },
  { path: 'posts/:id', component: PostDisplayComponent },
  { path: 'users/:userId', component: ProfileComponent },
];
