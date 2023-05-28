import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  signUpUrl = 'http://localhost:3001/signup'

  constructor(private http: HttpClient) { }

  createUser(user: User) {
    return this.http.post(this.signUpUrl, user);
  }
}
