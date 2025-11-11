import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitUserGroupListComponent } from './biit-user-group-list.component';
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitUserGroupListRoutingModule} from "./biit-user-group-list-routing.module";
import {UserGroupFormModule} from "../../shared/forms/user-group-form/user-group-form.module";
import {UserFormPopupModule} from "../../shared/popups/user-form-popup/user-form-popup.module";
import {UserRoleListModule} from "../../shared/lists/user-role-list/user-role-list.module";
import {UserGroupUserListModule} from "../../shared/lists/user-group-user-list/user-group-user-list.module";
import {UserGroupRoleListModule} from "../../shared/lists/user-group-role-list/user-group-role-list.module";
import {HasPermissionPipe} from "../../shared/pipes/has-permission.pipe";

@NgModule({
  declarations: [
    BiitUserGroupListComponent
  ],
  exports: [
    BiitUserGroupListComponent
  ],
    imports: [
        CommonModule,
        TranslocoRootModule,
        BiitUserGroupListRoutingModule,
        UserGroupFormModule,
        BiitDatatableModule,
        UserFormPopupModule,
        BiitPopupModule,
        BiitButtonModule,
        BiitIconButtonModule,
        UserRoleListModule,
        UserGroupUserListModule,
        UserGroupRoleListModule,
        HasPermissionPipe
    ],
  providers: [
    DatePipe
  ]
})
export class BiitUserGroupListModule { }
