import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;

    const userRole = this.loginService.getUserRole(); // Debes implementar esto en tu LoginService

    if (!userRole || !expectedRoles.includes(userRole)) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
