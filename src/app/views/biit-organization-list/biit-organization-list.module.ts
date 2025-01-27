import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitOrganizationListComponent } from './biit-organization-list.component';
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitOrganizationListRoutingModule} from "./biit-organization-list-routing.module";
import {OrganizationFormModule} from "../../shared/forms/organization-form/organization-form.module";
import {OrganizationTeamListModule} from "../../shared/lists/organization-team-list/organization-team-list.module";

@NgModule({
  declarations: [
    BiitOrganizationListComponent
  ],
  exports: [
    BiitOrganizationListComponent
  ],
  imports: [
    CommonModule,
    TranslocoRootModule,
    BiitOrganizationListRoutingModule,
    BiitDatatableModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitIconButtonModule,
    OrganizationFormModule,
    OrganizationTeamListModule,
  ],
  providers: [
    DatePipe
  ]
})
export class BiitOrganizationListModule { }
