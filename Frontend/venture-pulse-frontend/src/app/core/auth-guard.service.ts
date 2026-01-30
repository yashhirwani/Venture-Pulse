import { Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService  {

  // constructor(
  //   private authService: AuthService,
  //   private router: Router
  // ) {}

  // canActivate(): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true;
  //   }

  //   this.router.navigate(['/auth/login']);
  //   return false;
  // }
}
