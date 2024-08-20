import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleListComponent } from './user-role-list.component';
import {BiitDatatableModule, BiitTableModule} from "biit-ui/table";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitDropdownModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    UserRoleListComponent
  ],
  exports: [
    UserRoleListComponent
  ],
    imports: [
        CommonModule,
        BiitIconButtonModule,
        TranslocoModule,
        BiitButtonModule,
        BiitPopupModule,
        BiitDropdownModule,
        FormsModule,
        BiitDatatableModule
    ]
})
export class UserRoleListModule { }
