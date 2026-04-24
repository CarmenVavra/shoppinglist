import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0ResponseProfile } from './models/home.model';
import { catchError, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { User as MyUser } from '../user/models/user.model';
import { AuthService as MyAuthService } from '../auth/services/auth-service.service';
import { UserService } from '../user/services/user.service';
import { AuthOService } from '../auth/services/auth-o.service';
import { MatAnchor, MatButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatAnchor, MatButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly title = signal('shopping_list_app');
  readonly auth0Response = signal<Auth0ResponseProfile>({});
  readonly activeUser = signal<MyUser>({});
  protected readonly window = isPlatformBrowser(inject(PLATFORM_ID)) ? window : undefined;
  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  readonly unsubscribe$ = new Subject();

  #router = inject(Router);
  #myAuthService = inject(MyAuthService);
  #userService = inject(UserService);
  #authOService = inject(AuthOService);

  /**
   * Initializes the component by checking the authentication status and loading the user profile.
   * If the user is authenticated, it attempts to fetch the user from the database using their email.
   * If the user does not exist in the database, it saves the user from Auth0 to the database.
   * Finally, it stores the active user in local storage and navigates to the shopping list page for that user.
   */
  ngOnInit(): void {
    // TODO: Refactor this method to use async/await for better readability and error handling
    // When authenticated, switch to user$ to get the user profile
    this.auth?.isAuthenticated$.pipe(
      switchMap(isAuth => {
        if (isAuth && this.auth) {
          return this.auth.user$;
        }
        return [];
      }),
      switchMap(user => {
        this.auth0Response.set(user!);
        if (user) {
          return this.#userService.getUserByEmail(user.email!).pipe(
            catchError(error => {
              console.error('Error fetching user by email:', error);
              return of(null); // Return null if there's an error
            }),
            switchMap(userInDb => {
              if (userInDb) {
                return of(userInDb); // User exists in DB, return it
              } else {
                // User does not exist in DB, save it and return the saved user
                return this.#authOService.saveUserFromAuthOInDb(user).pipe(
                  catchError(error => {
                    console.error('Error saving user from Auth0 to DB:', error);
                    return of(null); // Return null if there's an error
                  })
                );
              }
            })
          );
        }
        return [];
      })
    ).subscribe((user) => {
      this.activeUser.set(user as MyUser);
      this.#myAuthService.storeUserToLocalStorage(user as MyUser);
      this.#router.navigateByUrl(`/shoppinglist/${user?.id}`);
    });
  }

  /**
   * Logs the user out of the application.
   * It removes the user from local storage and redirects to the application's origin after logout.
   */
  logout(): void {
    if (!this.auth) return;
    const returnTo = this.window?.location.origin ?? 'http://localhost:4200';
    this.auth.logout({ logoutParams: { returnTo } });
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
  }
}