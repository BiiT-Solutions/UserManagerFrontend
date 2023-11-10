import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRolesListComponent } from './application-roles-list.component';
import {BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
  declarations: [
    ApplicationRolesListComponent
  ],
  exports: [
    ApplicationRolesListComponent
  ],
  imports: [
    CommonModule,
    BiitIconButtonModule,
    BiitTableModule,
    TranslocoModule
  ]
})
export class ApplicationRolesListModule { }
