import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitRoleListComponent } from './biit-role-list.component';
import {BiitRoleListRoutingModule} from "./biit-role-list-routing.module";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {RoleFormModule} from "../../shared/role-form/role-form.module";
import {UserFormModule} from "../../shared/user-form/user-form.module";

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
    BiitTableModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitIconButtonModule,
    RoleFormModule,
    UserFormModule
  ]
})
export class BiitRoleListModule { }
