import {Component, OnInit} from '@angular/core';
import {UserManagerRootService} from "user-manager-structure-lib";
import {Environment} from "../environments/environment";
import {BiitSnackbarHorizontalPosition, BiitSnackbarService, BiitSnackbarVerticalPosition} from "biit-ui/info";
import {AvailableLangs, TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {SessionService} from "./services/session.service";
import {Route, Router} from "@angular/router";
import * as path from "path";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/main', alias: 'main'}
    }
  ]
})
export class AppComponent {
  protected menu: Route[]= [];
  constructor(userManagerRootService: UserManagerRootService,
              biitSnackbarService: BiitSnackbarService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.setLanguage();
    userManagerRootService.serverUrl = new URL(`${Environment.ROOT_URL}/${Environment.USER_MANAGER_PATH}`);
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
    this.setMenu();
  }

  private setMenu(): void {
    this.menu = [];
    this.translocoService.selectTranslate('users', {},  {scope: 'components/main'}).subscribe(msg => {
      this.menu.push({path: 'users', title: msg});
    });
    this.translocoService.selectTranslate('roles', {},  {scope: 'components/main'}).subscribe(msg => {
      this.menu.push({path: 'roles', title: msg});
    });
  }

  private setLanguage(): void {
    const clientLanguages: ReadonlyArray<string>= navigator.languages;
    const languages: AvailableLangs = this.translocoService.getAvailableLangs();
    const language: string = clientLanguages.find(lang => languages.map(lang => lang.toString()).includes(lang));
    if (language) {
      this.translocoService.setActiveLang(language);
    }
  }

  protected readonly SessionService = SessionService;

  logout() {
    this.router.navigate(['/login'], {queryParams: {logout: true}});
  }
}
