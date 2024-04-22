import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupUserListComponent } from './user-group-user-list.component';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {BiitPopupModule} from "biit-ui/popup";
import {UtilsModule} from "../../utils/utils.module";

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
        BiitTableModule,
        BiitIconButtonModule,
        BiitButtonModule,
        BiitPopupModule
    ]
})
export class UserGroupUserListModule { }
