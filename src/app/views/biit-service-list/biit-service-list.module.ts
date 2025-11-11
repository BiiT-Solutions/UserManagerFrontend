import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitServiceListComponent } from './biit-service-list.component';
import {BiitServiceListRoutingModule} from "./biit-service-list-routing.module";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitInputTextModule, BiitTextareaModule} from "@biit-solutions/wizardry-theme/inputs";
import {UtilsModule} from "../../shared/utils/utils.module";
import {FormsModule} from "@angular/forms";
import {ServiceRoleListModule} from "../../shared/lists/service-role-list/service-role-list.module";
import {HasPermissionPipe} from "../../shared/pipes/has-permission.pipe";

@NgModule({
  declarations: [
    BiitServiceListComponent
  ],
    imports: [
        CommonModule,
        BiitServiceListRoutingModule,
        BiitIconButtonModule,
        BiitDatatableModule,
        TranslocoModule,
        BiitPopupModule,
        BiitInputTextModule,
        UtilsModule,
        FormsModule,
        BiitTextareaModule,
        BiitButtonModule,
        ServiceRoleListModule,
        HasPermissionPipe
    ],
  providers: [
    DatePipe
  ]
})
export class BiitServiceListModule { }
