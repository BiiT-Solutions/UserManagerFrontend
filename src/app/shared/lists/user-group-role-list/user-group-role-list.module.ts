import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupRoleListComponent } from './user-group-role-list.component';
import {BiitDatatableModule, BiitTableModule} from "biit-ui/table";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitDropdownModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {BiitProgressBarModule} from "biit-ui/info";



@NgModule({
  declarations: [
    UserGroupRoleListComponent
  ],
  exports: [
    UserGroupRoleListComponent
  ],
    imports: [
        CommonModule,
        BiitIconButtonModule,
        TranslocoModule,
        BiitButtonModule,
        BiitPopupModule,
        BiitDropdownModule,
        FormsModule,
        BiitProgressBarModule,
        BiitDatatableModule
    ]
})
export class UserGroupRoleListModule { }
