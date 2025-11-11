import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitOrganizationListComponent } from './biit-organization-list.component';
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitOrganizationListRoutingModule} from "./biit-organization-list-routing.module";
import {OrganizationFormModule} from "../../shared/forms/organization-form/organization-form.module";
import {OrganizationTeamListModule} from "../../shared/lists/organization-team-list/organization-team-list.module";
import {HasPermissionPipe} from "../../shared/pipes/has-permission.pipe";

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
        HasPermissionPipe,
    ],
  providers: [
    DatePipe
  ]
})
export class BiitOrganizationListModule { }
