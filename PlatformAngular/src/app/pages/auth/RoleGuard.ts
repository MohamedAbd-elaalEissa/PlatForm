import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const roles = this.authService.getUserTokenRoles(); // Get the current user's roles
    const requiredRole = route.data['role']; // Get the required role from the route data

    if (roles.includes(requiredRole)) {
      return true; // Allow navigation if the user has the required role
    } else {
      this.router.navigate(['/notfound']); // Redirect to a "Not Authorized" page
      return false; // Deny navigation
    }
  }
}
