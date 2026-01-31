import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  otpMode = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    if (this.otpMode) {
      this.handleOtpLogin();
    } else {
      this.authService.login(this.loginData).subscribe({
        next: (res) => {
          console.log(res);
      localStorage.setItem('user', JSON.stringify(res.id));
      this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password.';
        }
      });
    }
  }

  handleOtpLogin() {
    // API logic for magic link
    console.log('OTP requested for:', this.loginData.email);
    this.isLoading = false;
    alert('Magic link sent to your email!');
  }

  socialLogin(provider: string) {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  }
}