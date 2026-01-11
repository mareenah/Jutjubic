import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Registration } from '../../models/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Address } from '../../models/address.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements OnInit {
  isPasswordVisible: boolean;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?@#$%^&*><:;,.()]).{8,}$/;

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

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.isPasswordVisible = false;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          {
            validators: [Validators.required, Validators.pattern(this.emailRegex)],
          },
        ],
        username: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(30),
              Validators.pattern(/^[\p{L}][\p{L}0-9._]{0,29}$/u),
            ],
          },
        ],
        password: [
          '',
          {
            validators: [Validators.required, Validators.pattern(this.passwordRegex)],
          },
        ],
        repeatPassword: ['', [Validators.required]],
        name: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(30),
              Validators.pattern(
                /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ' -]+$/
              ),
            ],
          },
        ],
        lastname: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(1),
              Validators.maxLength(30),
              Validators.pattern(
                /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ' -]+$/
              ),
            ],
          },
        ],
        country: [
          '',
          {
            validators: [
              Validators.maxLength(30),
              Validators.pattern(
                /^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\s'-]+$/
              ),
            ],
          },
        ],
        city: [
          '',
          {
            validators: [
              Validators.maxLength(30),
              Validators.pattern(
                /^$|^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ\s'-]+$/
              ),
            ],
          },
        ],
        street: [
          '',
          {
            validators: [
              Validators.maxLength(30),
              Validators.pattern(
                /^(?=.*[A-Za-zÀ-ÖØ-öø-ÿčćžđšČĆŽĐŠ])[A-Za-z0-9À-ÖØ-öø-ÿčćžđšČĆŽĐŠ\s\-\/]+$/
              ),
            ],
          },
        ],
      },
      {
        validators: this.matchPasswords('password', 'repeatPassword'),
      } as AbstractControlOptions
    );
  }

  matchPasswords(password: string, repeatPassword: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const passControl = control.get(password);
      const confirmPassControl = control.get(repeatPassword);

      if (!passControl || !confirmPassControl) {
        return null;
      }

      if (passControl.value !== confirmPassControl.value) {
        const errors = confirmPassControl.errors || {};
        errors['mismatch'] = true;
        confirmPassControl.setErrors(errors);
      } else {
        const errors = confirmPassControl.errors;
        if (errors) {
          delete errors['mismatch'];
          if (Object.keys(errors).length === 0) {
            confirmPassControl.setErrors(null);
          } else {
            confirmPassControl.setErrors(errors);
          }
        }
      }

      return null;
    };
  }

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
    } else {
      this.registerForm.markAllAsTouched();
      console.warn('Form is invalid', this.registerForm.errors);
      alert('Popuni formu validno!');
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
