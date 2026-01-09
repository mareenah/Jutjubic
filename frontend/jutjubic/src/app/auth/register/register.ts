import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Registration } from '../../models/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Address } from '../../models/address.model';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FontAwesomeModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  isPasswordVisible: boolean;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private authService: AuthService, private router: Router) {
    this.isPasswordVisible = false;
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    country: new FormControl(''),
    city: new FormControl(''),
    street: new FormControl(''),
  });

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  register(): void {
    if (this.registerForm.valid) {
      const address: Address = {
        id: 0,
        country: this.registerForm.value.country || '',
        city: this.registerForm.value.city || '',
        street: this.registerForm.value.street || '',
      };

      const register: Registration = {
        email: this.registerForm.value.email || '',
        username: this.registerForm.value.username || '',
        password: this.registerForm.value.password || '',
        repeatPassword: this.registerForm.value.repeatPassword || '',
        name: this.registerForm.value.name || '',
        lastname: this.registerForm.value.lastname || '',
        address: address,
      };

      this.authService.register(register).subscribe({
        next: () => {
          alert('Succesfully registered!\nVerify your account and login.');
          this.router.navigate(['']);
        },
        error: (error) => {
          switch (error.status) {
            case 400:
            case 409:
              alert(error.error.message);
              break;
            default:
              alert(error.error?.message || 'Unknown error occurred.');
              break;
          }
        },
      });
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
