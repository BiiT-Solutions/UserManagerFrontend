import { Component } from '@angular/core';
import {UserManagerRootService} from "user-manager-structure-lib";
import {Environment} from "../environments/environment";
import {BiitIconService} from "biit-ui/icon";
import {completeIconSet} from "biit-icons-collection";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(userManagerRootService: UserManagerRootService, biitIconsCollection: BiitIconService) {
    userManagerRootService.serverUrl = new URL(`${Environment.ROOT_URL}/${Environment.USER_MANAGER_PATH}`);
    biitIconsCollection.registerIcons(completeIconSet);
  }
}
