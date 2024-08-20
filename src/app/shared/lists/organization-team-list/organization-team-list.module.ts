import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { OrganizationTeamListComponent } from './organization-team-list.component';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitDatatableModule} from "biit-ui/table";
import {BiitPopupModule} from "biit-ui/popup";
import {UtilsModule} from "../../utils/utils.module";
import {BiitInputTextModule, BiitTextareaModule} from "biit-ui/inputs";
import {BiitIconModule} from "biit-ui/icon";

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
    BiitDatatableModule,
    BiitIconButtonModule,
    BiitButtonModule,
    BiitPopupModule,
    BiitInputTextModule,
    BiitTextareaModule,
    BiitIconModule
  ],
  providers: [
    DatePipe
  ]
})
export class OrganizationTeamListModule { }
