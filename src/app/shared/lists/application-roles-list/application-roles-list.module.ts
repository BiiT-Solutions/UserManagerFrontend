import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRolesListComponent } from './application-roles-list.component';
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitDropdownModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {AplicationRoleServicesModule} from "../aplication-role-services/aplication-role-services.module";



@NgModule({
  declarations: [
    ApplicationRolesListComponent
  ],
  exports: [
    ApplicationRolesListComponent
  ],
  imports: [
    CommonModule,
    BiitIconButtonModule,
    BiitDatatableModule,
    TranslocoModule,
    BiitPopupModule,
    BiitDropdownModule,
    BiitButtonModule,
    FormsModule,
    AplicationRoleServicesModule
  ]
})
export class ApplicationRolesListModule { }
