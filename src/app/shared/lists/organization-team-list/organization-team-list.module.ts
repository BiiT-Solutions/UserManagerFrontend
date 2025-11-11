import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { OrganizationTeamListComponent } from './organization-team-list.component';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {UtilsModule} from "../../utils/utils.module";
import {BiitInputTextModule, BiitTextareaModule} from "@biit-solutions/wizardry-theme/inputs";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";

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
