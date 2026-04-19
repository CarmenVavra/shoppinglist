import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth-service.service";
import { map } from "rxjs";
import { USER_TYPE } from "../models/auth.model";

@Injectable()

export class RegisterGuard implements CanActivate {

  #authService = inject(AuthService);
  #router = inject(Router);

  constructor() {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const loggedInUser = this.#authService.getStoredUser();
    const roleId = loggedInUser?.roleId;
    return roleId == USER_TYPE.ADMIN;
  }

}