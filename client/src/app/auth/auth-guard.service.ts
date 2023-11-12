import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../shared/models/user';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let { isAuthenticated, user } = await this.authService.isAuthenticated();

    if (!isAuthenticated) {
      this.router.navigate(['register']);
      return false;
    }

    let roles = route.data["roles"] as (Role[] | undefined);

    if(roles)
    {
      if(!roles.some(role => role === user?.role))
      {
        this.router.navigate(['register']);
        return false;
      }
    }

    return true;
  }
}
