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

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, FontAwesomeModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  isPasswordVisible: boolean;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private authService: AuthService, private router: Router) {
    this.isPasswordVisible = false;
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
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
    }
  }

  register(): void {
    this.router.navigate(['/register']);
  }
}
