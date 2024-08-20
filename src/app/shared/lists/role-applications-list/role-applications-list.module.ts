import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleApplicationsListComponent } from './role-applications-list.component';
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitDropdownModule} from "biit-ui/inputs";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    RoleApplicationsListComponent
  ],
  exports: [
    RoleApplicationsListComponent
  ],
  imports: [
    CommonModule,
    BiitButtonModule,
    BiitDropdownModule,
    BiitIconButtonModule,
    BiitPopupModule,
    BiitDatatableModule,
    TranslocoModule,
    FormsModule
  ]
})
export class RoleApplicationsListModule { }
