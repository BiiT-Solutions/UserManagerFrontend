import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoleListComponent } from './service-role-list.component';
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitInputTextModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ServiceRoleListComponent
  ],
  exports: [
    ServiceRoleListComponent
  ],
  imports: [
    CommonModule,
    BiitPopupModule,
    BiitDatatableModule,
    BiitIconButtonModule,
    TranslocoModule,
    BiitInputTextModule,
    FormsModule,
    BiitButtonModule
  ]
})
export class ServiceRoleListModule { }
