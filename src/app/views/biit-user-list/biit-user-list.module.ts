import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitUserListComponent } from './biit-user-list.component';
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitUserListRoutingModule} from "./biit-user-list-routing.module";
import {UserFormPopupModule} from "../../shared/popups/user-form-popup/user-form-popup.module";
import {UserRoleListModule} from "../../shared/lists/user-role-list/user-role-list.module";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {UserGroupListModule} from "../../shared/lists/user-group-list/user-group-list.module";
import {HasPermissionPipe} from "../../shared/pipes/has-permission.pipe";

@NgModule({
  declarations: [
    BiitUserListComponent
  ],
  exports: [
    BiitUserListComponent
  ],
    imports: [
        CommonModule,
        TranslocoRootModule,
        BiitUserListRoutingModule,
        BiitDatatableModule,
        UserFormPopupModule,
        BiitPopupModule,
        BiitButtonModule,
        BiitIconButtonModule,
        UserRoleListModule,
        BiitIconModule,
        UserGroupListModule,
        HasPermissionPipe
    ],
  providers: [
    DatePipe
  ]
})
export class BiitUserListModule { }
