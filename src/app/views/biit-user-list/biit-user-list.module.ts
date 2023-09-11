import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitUserListComponent } from './biit-user-list.component';
import {BiitTableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {UserFormModule} from "../../shared/user-form/user-form.module";
import {BiitPopupModule} from "biit-ui/popup";
import {BiitButtonModule} from "biit-ui/button";



@NgModule({
  declarations: [
    BiitUserListComponent
  ],
  exports: [
    BiitUserListComponent
  ],
  imports: [
    CommonModule,
    TranslocoRootModule,
    BiitTableModule,
    UserFormModule,
    BiitPopupModule,
    BiitButtonModule
  ]
})
export class BiitUserListModule { }
