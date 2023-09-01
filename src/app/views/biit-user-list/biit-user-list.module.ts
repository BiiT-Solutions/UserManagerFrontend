import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitUserListComponent } from './biit-user-list.component';
import {BiitTableModule} from "biit-ui/table";
import {TranslocoRootModule} from "biit-ui/i18n";
import {UserFormModule} from "../../shared/user-form/user-form.module";



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
    UserFormModule
  ]
})
export class BiitUserListModule { }
