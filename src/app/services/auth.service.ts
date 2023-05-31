import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user";
import { BehaviorSubject, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signUpUrl = 'http://localhost:3001/signup'
  signInUrl = 'http://localhost:3001/signin'
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable()

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
  }

  createUser(user: User) {
    return this.http.post(this.signUpUrl, user)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
          this._isLoggedIn$.next(true);
        })
    );
  }

  signIn(user: any) {
    console.log(user)
    return this.http.post(this.signInUrl, user)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
          this._isLoggedIn$.next(true);
        })
      );
  }
}
