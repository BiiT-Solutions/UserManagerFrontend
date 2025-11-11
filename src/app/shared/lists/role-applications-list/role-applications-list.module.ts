import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleApplicationsListComponent } from './role-applications-list.component';
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitDropdownModule} from "@biit-solutions/wizardry-theme/inputs";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoModule} from "@ngneat/transloco";
import {FormsModule} from "@angular/forms";
import {ApplicationRoleServicesModule} from "../application-role-services/application-role-services.module";



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
        FormsModule,
        ApplicationRoleServicesModule
    ]
})
export class RoleApplicationsListModule { }
