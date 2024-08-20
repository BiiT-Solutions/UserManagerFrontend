import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BiitServiceListComponent } from './biit-service-list.component';
import {BiitServiceListRoutingModule} from "./biit-service-list-routing.module";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {BiitDatatableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitInputTextModule, BiitTextareaModule} from "biit-ui/inputs";
import {UtilsModule} from "../../shared/utils/utils.module";
import {FormsModule} from "@angular/forms";
import {ServiceRoleListModule} from "../../shared/lists/service-role-list/service-role-list.module";

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
    ServiceRoleListModule
  ],
  providers: [
    DatePipe
  ]
})
export class BiitServiceListModule { }
