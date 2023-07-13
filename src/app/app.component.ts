import {Component, OnInit} from '@angular/core';
import {UserManagerRootService} from "user-manager-structure-lib";
import {Environment} from "../environments/environment";
import {BiitIconService} from "biit-ui/icon";
import {BiitSnackbarHorizontalPosition, BiitSnackbarService, BiitSnackbarVerticalPosition} from "biit-ui/info";
import {AvailableLangs, TranslocoService} from "@ngneat/transloco";
import {completeIconSet} from "biit-icons-collection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(userManagerRootService: UserManagerRootService,
              biitSnackbarService: BiitSnackbarService, private translocoService: TranslocoService) {
    this.setLanguage();
    userManagerRootService.serverUrl = new URL(`${Environment.ROOT_URL}/${Environment.USER_MANAGER_PATH}`);
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
  }

  private setLanguage(): void {
    const clientLanguages: ReadonlyArray<string>= navigator.languages;
    const languages: AvailableLangs = this.translocoService.getAvailableLangs();
    const language: string = clientLanguages.find(lang => languages.map(lang => lang.toString()).includes(lang));
    if (language) {
      this.translocoService.setActiveLang(language);
    }
  }
}
