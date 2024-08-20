import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { UserGroupUserListComponent } from './user-group-user-list.component';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitDatatableModule} from "biit-ui/table";
import {BiitPopupModule} from "biit-ui/popup";
import {UtilsModule} from "../../utils/utils.module";
import {BiitIconModule} from "biit-ui/icon";

@NgModule({
  declarations: [
    UserGroupUserListComponent
  ],
  exports: [
    UserGroupUserListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoRootModule,
    UtilsModule,
    BiitIconButtonModule,
    BiitButtonModule,
    BiitPopupModule,
    BiitDatatableModule,
    BiitIconModule
  ],
  providers: [
    DatePipe
  ]
})
export class UserGroupUserListModule { }
