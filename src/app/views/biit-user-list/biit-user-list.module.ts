import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitUserListComponent } from './biit-user-list.component';
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitUserListRoutingModule} from "./biit-user-list-routing.module";
import {UserFormModule} from "../../shared/forms/user-form/user-form.module";
import {UserRoleListModule} from "../../shared/lists/user-role-list/user-role-list.module";
import {BiitIconModule} from "biit-ui/icon";

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
    UserFormModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitIconButtonModule,
    UserRoleListModule,
    BiitIconModule
  ],
  providers: [
    DatePipe
  ]
})
export class BiitUserListModule { }
