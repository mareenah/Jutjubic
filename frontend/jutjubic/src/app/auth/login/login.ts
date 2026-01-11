import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../models/login.model';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  isPasswordVisible: boolean;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  user: User | undefined;
  emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?@#$%^&*><:;,.()]).{8,}$/;

  constructor(private authService: AuthService, private router: Router) {
    this.isPasswordVisible = false;
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailRegex)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordRegex)]),
  });

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  login(): void {
    const login: Login = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: () => {
          alert('Succesfully logged in!');
          this.router.navigate(['']);
        },
        error: (error) => {
          switch (error.status) {
            case 400:
            case 401:
            case 403:
            case 429:
              alert(error.error.message);
              break;
            default:
              alert('Login failed due to an unexpected error.');
              break;
          }
        },
      });
    } else {
      alert('Popuni formu validno!');
      console.warn('Form is invalid', this.loginForm.errors);
    }
  }

  register(): void {
    this.router.navigate(['/register']);
  }
}
