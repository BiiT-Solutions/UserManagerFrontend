import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleListComponent } from './user-role-list.component';
import {BiitTableModule} from "biit-ui/table";
import {BiitIconButtonModule} from "biit-ui/button";
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
  declarations: [
    UserRoleListComponent
  ],
  exports: [
    UserRoleListComponent
  ],
  imports: [
    CommonModule,
    BiitTableModule,
    BiitIconButtonModule,
    TranslocoModule
  ]
})
export class UserRoleListModule { }
