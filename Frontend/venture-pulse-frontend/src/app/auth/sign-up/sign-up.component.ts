import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  userData = { name: '', email: '', password: '', confirmPassword: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignUp() {
  if (this.userData.password !== this.userData.confirmPassword) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  const { confirmPassword, ...payload } = this.userData;

  this.authService.signup(payload).subscribe({
    next: () => {
      this.isLoading = false;
      this.router.navigate(['/login'], { queryParams: { registered: true } });
    },
    error: (err) => {
      this.isLoading = false;

      // 🔥 IMPORTANT FIX
      if (err.status === 200 || err.status === 201) {
        // Backend returned success but Angular mis-read it
        this.router.navigate(['/login'], { queryParams: { registered: true } });
        return;
      }

      this.errorMessage =
        err?.error?.message ||
        err?.error ||
        'Registration failed';
    }
  });
}


  socialLogin(provider: string) {
  // Ensure your Spring Boot backend has: 
  // /oauth2/authorization/google, /github, and /linkedin
  window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
}
}