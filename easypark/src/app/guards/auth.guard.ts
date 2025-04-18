import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
    providedIn: 'root'
})
export class authGuard implements CanActivate {

   constructor(private loginService: LoginService, private router: Router) {}

    canActivate(): boolean {
      if (!this.loginService.isAuthenticated()) {
        // Limpia residuos por si acaso
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    
}