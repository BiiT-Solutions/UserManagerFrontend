import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationTeamListComponent } from './organization-team-list.component';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {BiitPopupModule} from "biit-ui/popup";
import {UtilsModule} from "../../utils/utils.module";
import {BiitInputTextModule, BiitTextareaModule} from "biit-ui/inputs";

@NgModule({
  declarations: [
    OrganizationTeamListComponent
  ],
  exports: [
    OrganizationTeamListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoRootModule,
    UtilsModule,
    BiitTableModule,
    BiitIconButtonModule,
    BiitButtonModule,
    BiitPopupModule,
    BiitInputTextModule,
    BiitTextareaModule
  ]
})
export class OrganizationTeamListModule { }
