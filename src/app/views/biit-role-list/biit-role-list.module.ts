import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitRoleListComponent } from './biit-role-list.component';
import {BiitRoleListRoutingModule} from "./biit-role-list-routing.module";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {RoleApplicationsListModule} from "../../shared/lists/role-applications-list/role-applications-list.module";
import {RoleFormModule} from "../../shared/forms/role-form/role-form.module";
import {UserFormPopupModule} from "../../shared/popups/user-form-popup/user-form-popup.module";
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
        UserFormPopupModule,
        ApplicationRolesListModule,
        RoleApplicationsListModule,
        HasPermissionPipe
    ],
  providers: [
    DatePipe
  ]
})
export class BiitRoleListModule { }
