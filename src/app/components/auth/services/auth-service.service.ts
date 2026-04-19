import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_DATA, USER_TYPE } from '../models/auth.model';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { error } from 'console';
import { LocalStorageService } from './local-storage.service';
import { User } from '../../user/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  #localStorageService = inject(LocalStorageService);

  baseUrl = 'http://localhost:8080/auth';

  private subject = new BehaviorSubject<User>(null!);
  user$: Observable<User> = this.subject.asObservable();

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
    this.isLoggedIn$.subscribe((loggedInValue) => {
      console.log('loggedInValue', loggedInValue);
    });
    const user = this.#localStorageService.getFromLocalStorage(AUTH_DATA);
    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  register(user: User): Observable<User> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    user.roleId = USER_TYPE.USER;
    delete user.passwordRep;

    return this.#http.post(`${this.baseUrl}/register`, user, { headers }).pipe(
      map((res: any) => {
        this.#localStorageService.saveToLocalStorage(AUTH_DATA, JSON.stringify(res));
        this.subject.next(res);
        return res;
      })
    );
  }

  login(user: User): Observable<User> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.#http.get(`${this.baseUrl}/login?email=${user.email}&password=${user.password}`, { headers }).pipe(
      map((res: any) => {
        this.#localStorageService.saveToLocalStorage(AUTH_DATA, JSON.stringify(res));
        this.subject.next(res);
        return res;
      })
    );
  }

  storeUserToLocalStorage(user: User): User {
    this.#localStorageService.saveToLocalStorage(AUTH_DATA, JSON.stringify(user));
    this.subject.next(user);
    return user;
  }

  hideNavigation() {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem(AUTH_DATA);
      if (authData) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  getStoredUser(): User {
    const storedUser = this.#localStorageService.getFromLocalStorage(AUTH_DATA);
    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }
    return null!;
  }

  getRegisteredUsers(): Observable<User[]> {
    return this.#http.get(`${this.baseUrl}/all`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  removeUserFromLocalStorage() {
    this.#localStorageService.clearLocalStorage();
  }


}
