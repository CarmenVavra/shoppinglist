import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Auth0ResponseProfile, AUTH_DATA } from '../models/auth.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../../user/models/user.model';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthOService {
  private subject = new BehaviorSubject<Auth0ResponseProfile>(null!);

  #http = inject(HttpClient);
  #myAuthService = inject(AuthService);

  baseUrl = 'http://localhost:8080/authO';

  saveUserFromAuthOInDb(profile: Auth0ResponseProfile): Observable<User> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.#http.post(`${this.baseUrl}`, profile, { headers }).pipe(
      map((res: User) => {
        this.#myAuthService.storeUserToLocalStorage(res);
        return res;
      })
    );
  }

}
