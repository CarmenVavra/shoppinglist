import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }


  public saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getFromLocalStorage(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return '';
  }

  public removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  public clearLocalStorage() {
    localStorage.clear();
  }
}
