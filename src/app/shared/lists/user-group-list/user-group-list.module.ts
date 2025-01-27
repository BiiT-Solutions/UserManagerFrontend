import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { UserGroupListComponent } from './user-group-list.component';
import {BiitDatatableModule} from "biit-ui/table";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitDropdownModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {BiitIconModule} from "biit-ui/icon";

@NgModule({
  declarations: [
    UserGroupListComponent
  ],
  exports: [
    UserGroupListComponent
  ],
  imports: [
    CommonModule,
    BiitIconButtonModule,
    TranslocoModule,
    BiitButtonModule,
    BiitPopupModule,
    BiitDropdownModule,
    FormsModule,
    BiitDatatableModule,
    BiitIconModule
  ],
  providers: [
    DatePipe
  ]
})
export class UserGroupListModule { }
