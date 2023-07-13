import {Injectable, OnDestroy} from '@angular/core';
import {Constants} from "../shared/constants";
import {User} from "user-manager-structure-lib";

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {

  private authToken: string;
  private expires: number;
  private store: boolean;
  private user: User;

  constructor() {
    const authToken: string = sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
    const expires: number = +sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
    if (authToken) {
      this.authToken = authToken;
      this.store = true;
      if (expires && !isNaN(expires)) {
        this.expires = expires;
      }
    }
  }

  ngOnDestroy(): void {
    this.clearToken();
  }

  clearToken(): void {
    this.authToken = undefined;
    this.store = undefined;
    this.user = undefined;
    sessionStorage.removeItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
    sessionStorage.removeItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
  }

  setToken(token: string, expires: number, enableStore: boolean = undefined): void {
    this.authToken = token;
    this.expires = expires;
    if (enableStore !== undefined) {
      this.store = enableStore;
      if (!enableStore) {
        sessionStorage.removeItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
        sessionStorage.removeItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
      }
    }
    if (this.store) {
      sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_TOKEN, token);
      sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION, expires.toString());
    }
  }

  getToken(): string {
    return this.authToken;
  }

  isTokenExpired(): boolean {
    return !this.expires || new Date().getTime() > this.expires || !this.getToken();
  }
  getExpirationDate(): Date {
    return new Date(this.expires);
  }

  setUser(user: User): void {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

}
