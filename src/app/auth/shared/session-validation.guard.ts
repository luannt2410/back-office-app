import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class SessionValidationGuard implements CanActivate {
    constructor(
        protected router: Router,
        private authService: AuthService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        if (localStorage.getItem('currentUser') == null) {
            this.ShowLogin(state.url);
            return false;
        }
        return true;

    }
    private ShowLogin(redirect: string) {
        this.router.navigate(["/auth/login"]);
    }
}