import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitUserListComponent } from './biit-user-list.component';
import {BiitTableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {UserFormModule} from "../../shared/user-form/user-form.module";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitUserListRoutingModule} from "./biit-user-list-routing.module";
import {UserRoleListModule} from "../../shared/user-role-list/user-role-list.module";

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
    BiitTableModule,
    UserFormModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitIconButtonModule,
    UserRoleListModule
  ]
})
export class BiitUserListModule { }
