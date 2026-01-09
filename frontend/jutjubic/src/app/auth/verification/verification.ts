import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.html',
  styleUrl: './verification.css',
})
export class VerificationComponent implements OnInit {
  verificationCode: String = '';
  verified: Boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.verificationCode = params['verificationCode'];
      this.authService.verify(this.verificationCode).subscribe({
        next: () => {
          this.verified = true;
          this.router.navigate(['/login']);
          alert('Congratulations, your account is verified successfully!');
        },
        error: (error) => {
          this.verified = false;
          switch (error.status) {
            case 400:
            case 410:
              alert(error.error.message);
              this.router.navigate(['/register']);
              return;
            case 409:
              alert(error.error.message);
              this.router.navigate(['/login']);
              return;
            default:
              alert('Verification failed due to an unexpected error.');
              this.router.navigate(['/register']);
              return;
          }
        },
      });
    });
  }
}
