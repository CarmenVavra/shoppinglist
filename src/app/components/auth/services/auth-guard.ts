import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth-service.service";
import { map, take } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { AUTH_DATA } from "../models/auth.model";

@Injectable()

export class AuthGuard implements CanActivate {

  #authService = inject(AuthService);
  #router = inject(Router);
  #localStorageService = inject(LocalStorageService);

  constructor() {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    // First check if user is stored in localStorage (handles page refresh/manual navigation)
    const storedUser = this.#localStorageService.getFromLocalStorage(AUTH_DATA);

    if (storedUser) {
      // User is logged in based on localStorage
      return true;
    }

    // Fall back to checking the observable (for real-time logout scenarios)
    return this.#authService.isLoggedIn$.pipe(
      take(1),
      map(loggedIn => loggedIn ? true : this.#router.parseUrl('/login'))
    );
  }

}