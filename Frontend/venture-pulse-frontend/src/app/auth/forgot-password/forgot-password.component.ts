import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;
  isEmailSent: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onResetPassword(): void {
    if (!this.email) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Communicates with GET/POST /api/auth/forgot-password
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEmailSent = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'We couldn\'t find an account with that email address.';
      }
    });
  }
}