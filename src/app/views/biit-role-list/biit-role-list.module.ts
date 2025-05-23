import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitRoleListComponent } from './biit-role-list.component';
import {BiitRoleListRoutingModule} from "./biit-role-list-routing.module";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {RoleApplicationsListModule} from "../../shared/lists/role-applications-list/role-applications-list.module";
import {RoleFormModule} from "../../shared/forms/role-form/role-form.module";
import {UserFormModule} from "../../shared/forms/user-form/user-form.module";
import {ApplicationRolesListModule} from "../../shared/lists/application-roles-list/application-roles-list.module";
import {HasPermissionPipe} from "../../shared/pipes/has-permission.pipe";

@NgModule({
  declarations: [
    BiitRoleListComponent
  ],
  exports: [
    BiitRoleListComponent
  ],
    imports: [
        CommonModule,
        BiitRoleListRoutingModule,
        TranslocoModule,
        BiitDatatableModule,
        BiitPopupModule,
        BiitButtonModule,
        BiitIconButtonModule,
        RoleFormModule,
        UserFormModule,
        ApplicationRolesListModule,
        RoleApplicationsListModule,
        HasPermissionPipe
    ],
  providers: [
    DatePipe
  ]
})
export class BiitRoleListModule { }
