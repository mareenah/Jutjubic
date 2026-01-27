import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { VerificationComponent } from './auth/verification/verification';
import { Home } from './features/layout/home/home/home';
import { PostDisplayComponent } from './features/stakeholder/post-display/post-display';
import { ProfileComponent } from './features/stakeholder/profile/profile';
import { guestGuard } from './auth/guards/guest.guard';
import { authGuard } from './auth/guards/auth.guard';
import { VideoCreateComponent } from './features/stakeholder/video-create/video-create';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'verify/:verificationCode', component: VerificationComponent, canActivate: [guestGuard] },
  { path: '', component: Home },
  {
    path: 'upload',
    canActivate: [authGuard],
    children: [
      { path: '', component: VideoCreateComponent },
      { path: 'details', component: VideoCreateComponent },
    ],
  },
  { path: 'posts/:id', component: PostDisplayComponent },
  { path: 'users/:userId', component: ProfileComponent },
];
