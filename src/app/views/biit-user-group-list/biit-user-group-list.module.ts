import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitUserGroupListComponent } from './biit-user-group-list.component';
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitUserGroupListRoutingModule} from "./biit-user-group-list-routing.module";
import {UserGroupFormModule} from "../../shared/forms/user-group-form/user-group-form.module";
import {UserFormModule} from "../../shared/forms/user-form/user-form.module";
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
        UserFormModule,
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
