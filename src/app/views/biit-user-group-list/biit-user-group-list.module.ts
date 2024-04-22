import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitUserGroupListComponent } from './biit-user-group-list.component';
import {BiitTableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitUserGroupListRoutingModule} from "./biit-user-group-list-routing.module";
import {UserGroupFormModule} from "../../shared/forms/user-group-form/user-group-form.module";
import {UserFormModule} from "../../shared/forms/user-form/user-form.module";
import {UserRoleListModule} from "../../shared/lists/user-role-list/user-role-list.module";
import {UserGroupUserListModule} from "../../shared/lists/user-group-user-list/user-group-user-list.module";
import {UserGroupRoleListModule} from "../../shared/lists/user-group-role-list/user-group-role-list.module";

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
        BiitTableModule,
        UserFormModule,
        BiitPopupModule,
        BiitButtonModule,
        BiitIconButtonModule,
        UserRoleListModule,
        UserGroupUserListModule,
        UserGroupRoleListModule
    ]
})
export class BiitUserGroupListModule { }
