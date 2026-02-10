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
import { VideoDetailCreateComponent } from './features/stakeholder/video-detail-create/video-detail-create';
import { WatchPartyCreateComponent } from './features/stakeholder/watch-party-create/watch-party-create';
import { WatchPartyDisplayComponent } from './features/stakeholder/watch-party-display/watch-party-display';
import { WatchPartiesDisplayComponent } from './features/stakeholder/watch-parties-display/watch-parties-display';

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
      { path: 'details', component: VideoDetailCreateComponent },
    ],
  },
  { path: 'posts/:id', component: PostDisplayComponent },
  { path: 'users/:userId', component: ProfileComponent },
  { path: 'watch-party', component: WatchPartyCreateComponent, canActivate: [authGuard] },
  {
    path: 'watch-party/:id/:postId',
    component: WatchPartyDisplayComponent,
    canActivate: [authGuard],
  },
  { path: 'watch-parties', component: WatchPartiesDisplayComponent, canActivate: [authGuard] },
];
