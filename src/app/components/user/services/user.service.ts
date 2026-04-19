import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../auth/services/local-storage.service';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  #http = inject(HttpClient);

  baseUrl = 'http://localhost:8080/user';

  getUserById(userId: number): Observable<User> {
    return this.#http.get(`${this.baseUrl}/getByUserId?id=${userId}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.#http.get(`${this.baseUrl}?email=${email}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
