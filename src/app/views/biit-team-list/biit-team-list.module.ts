import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitTeamListComponent } from './biit-team-list.component';
import {TranslocoModule} from "@ngneat/transloco";
import {OrganizationTeamListModule} from "../../shared/lists/organization-team-list/organization-team-list.module";
import {BiitOrganizationListRoutingModule} from "../biit-organization-list/biit-organization-list-routing.module";
import {BiitTeamListRoutingModule} from "./biit-team-list-routing.module";



@NgModule({
  declarations: [
    BiitTeamListComponent
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    OrganizationTeamListModule,
    BiitTeamListRoutingModule
  ]
})
export class BiitTeamListModule { }
