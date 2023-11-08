import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoleListComponent } from './service-role-list.component';
import {BiitPopupModule} from "biit-ui/popup";
import {BiitTableModule} from "biit-ui/table";
import {BiitButtonModule, BiitIconButtonModule} from "biit-ui/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitInputTextModule} from "biit-ui/inputs";
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
    BiitTableModule,
    BiitIconButtonModule,
    TranslocoModule,
    BiitInputTextModule,
    FormsModule,
    BiitButtonModule
  ]
})
export class ServiceRoleListModule { }
