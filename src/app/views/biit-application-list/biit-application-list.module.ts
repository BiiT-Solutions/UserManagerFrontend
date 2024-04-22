import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitApplicationListComponent } from './biit-application-list.component';
import {BiitApplicationListRoutingModule} from "./biit-application-list-routing.module";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {RoleFormModule} from "../../shared/forms/role-form/role-form.module";
import {ApplicationFormModule} from "../../shared/forms/application-form/application-form.module";
import {ApplicationRolesListModule} from "../../shared/lists/application-roles-list/application-roles-list.module";

@NgModule({
  declarations: [
    BiitApplicationListComponent
  ],
  exports: [
    BiitApplicationListComponent
  ],
  imports: [
    CommonModule,
    BiitApplicationListRoutingModule,
    TranslocoModule,
    BiitTableModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitIconButtonModule,
    RoleFormModule,
    ApplicationFormModule,
    ApplicationRolesListModule
  ]
})
export class BiitApplicationListModule { }
