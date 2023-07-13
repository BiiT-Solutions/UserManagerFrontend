import {Component, Inject, OnInit} from '@angular/core';
import {BiitLogin} from "biit-ui/models";
import {AuthService, LoginRequest, User} from "user-manager-structure-lib";
import {Constants} from "../../shared/constants";
import {HttpResponse} from "@angular/common/http";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoScope, TranslocoService} from "@ngneat/transloco";
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";

@Component({
  selector: 'biit-login-page',
  templateUrl: './biit-login-page.component.html',
  styleUrls: ['./biit-login-page.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'errors/login', alias: 'errors'}
    }
  ]
})
export class BiitLoginPageComponent{

  constructor(private authService: AuthService,
              private biitSnackbarService: BiitSnackbarService,
              private biitIconService: BiitIconService,
              private translocoService: TranslocoService) {
    biitIconService.registerIcons(completeIconSet);
  }

  login(login: BiitLogin): void {
    this.authService.login(new LoginRequest(login.username, login.password)).subscribe({
      next: (response: HttpResponse<User>) => {
        sessionStorage.setItem(Constants.SESSION_STORAGE.AUTH_TOKEN, response.headers.get(Constants.HEADERS.AUTHORIZATION));
        const user: User = response.body;
      },
      error: (response: HttpResponse<void>) => {
        const error: string = response.status.toString();
        // Transloco does not load translation files. We need to load it manually;
        this.translocoService.selectTranslate(error, {},  {scope: 'errors/login'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    });
  }
}
