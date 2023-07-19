import {Injectable, OnDestroy} from '@angular/core';
import {Constants} from "../shared/constants";
import {AuthService} from "user-manager-structure-lib";
import {TokenRenewListener, User} from "authorization-services-lib";

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy, TokenRenewListener {

  private store: boolean;
  constructor(private authService: AuthService) {
    const authToken: string = localStorage.getItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
    const expires: number = +localStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
    if (!expires || isNaN(expires) || expires < new Date().getTime()) {
      localStorage.removeItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
      localStorage.removeItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
    }
    if (authToken) {
      sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_TOKEN, authToken);
      this.store = true;
      if (expires && !isNaN(expires)) {
        sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION, expires.toString());
      }
    }
    if ((authToken && expires)
      || (sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_TOKEN) && sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION))) {
      this.setAutoRenew(authToken? authToken : sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_TOKEN)
        , expires ? expires : +sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION));
    }
  }

  onTokenReceived(token: string, expiration: number): void {
      this.setToken(token, expiration);
      console.log('Token has been renewed successfully.', token);
  }
  onException(error: any): void {
      console.error('There was an exception while renewing the token.');
      this.clearToken();
  }

  private setAutoRenew(token: string, expires: number): void {
    // ADD HERE ALL SERVICES NEED TO BE CALLED TO RENEW TOKEN
    this.authService.autoRenewToken(token, expires, this);
  }

  ngOnDestroy(): void {
    this.clearToken();
  }

  clearToken(): void {
    sessionStorage.removeItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
    sessionStorage.removeItem(Constants.SESSION_STORAGE.USER);
    this.store = undefined;
    localStorage.removeItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
    localStorage.removeItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
  }

  setToken(token: string, expires: number, enableStore: boolean = undefined, autoRenew: boolean = false): void {
    if (!token || !expires) {
      this.clearToken();
      return;
    }
    sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_TOKEN, token);
    sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION, expires.toString());
    if (enableStore !== undefined) {
      this.store = enableStore;
      if (!enableStore) {
        localStorage.removeItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
        localStorage.removeItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
      }
    }
    if (this.store) {
      localStorage.setItem(Constants.SESSION_STORAGE.AUTH_TOKEN, token);
      localStorage.setItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION, expires.toString());
    }
    if (autoRenew) {
      this.setAutoRenew(token, expires);
    }
  }

  getToken(): string {
    return sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_TOKEN);
  }

  isTokenExpired(): boolean {
    return !sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION) ||
      new Date().getTime() > +sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION) || !this.getToken();
  }
  getExpirationDate(): Date {
    const sessionExpiration = sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION);
    if (!isNaN(+sessionExpiration)) {
      return new Date(+sessionStorage.getItem(Constants.SESSION_STORAGE.AUTH_EXPIRATION));
    }
    return null;
  }

  setUser(user: User): void {
    sessionStorage.setItem(Constants.SESSION_STORAGE.USER, JSON.stringify(user));
  }

  getUser(): User {
    return sessionStorage.getItem(Constants.SESSION_STORAGE.USER) ? User.clone(JSON.parse(sessionStorage.getItem(Constants.SESSION_STORAGE.USER))) : null;
  }

}
