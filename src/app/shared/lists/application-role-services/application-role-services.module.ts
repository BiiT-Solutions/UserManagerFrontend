import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplicationRoleServicesComponent} from './application-role-services.component';
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitDropdownModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ApplicationRoleServicesComponent
  ],
  exports: [
    ApplicationRoleServicesComponent
  ],
  imports: [
    CommonModule,
    BiitIconButtonModule,
    BiitDatatableModule,
    TranslocoModule,
    BiitPopupModule,
    BiitButtonModule,
    BiitDropdownModule,
    FormsModule
  ]
})
export class ApplicationRoleServicesModule { }
