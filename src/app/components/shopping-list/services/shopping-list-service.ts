import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ListItem } from '../models/shopping-list-model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {

  #http = inject(HttpClient);

  baseUrl = 'http://localhost:8080/shoppinglist';

  constructor() { }

  getAll(): Observable<ListItem[]> {
    return this.#http.get(`${this.baseUrl}/all`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getAllByUserId(userId: number): Observable<ListItem[]> {
    return this.#http.get(`${this.baseUrl}?id=${userId}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  create(item: ListItem): Observable<ListItem> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.#http.post(`${this.baseUrl}`, item, { headers }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  update(item: ListItem): Observable<ListItem> {
    return this.#http.put(`${this.baseUrl}`, item).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  delete(id: number): Observable<string> {
    return this.#http.delete(`${this.baseUrl}?id=${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  check(item: ListItem): Observable<ListItem> {
    return this.#http.patch(`${this.baseUrl}/setChecked?isChecked=${item.checked}&id=${item.id}`, item).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
