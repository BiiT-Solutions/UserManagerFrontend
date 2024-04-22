import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AplicationRoleServicesComponent} from './aplication-role-services.component';
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitDropdownModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AplicationRoleServicesComponent
  ],
  exports: [
    AplicationRoleServicesComponent
  ],
  imports: [
    CommonModule,
    BiitIconButtonModule,
    BiitTableModule,
    TranslocoModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitDropdownModule,
    FormsModule
  ]
})
export class AplicationRoleServicesModule { }
