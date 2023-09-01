import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form.component';
import {BiitPopupModule} from "biit-ui/popup";
import {BiitTabGroupModule} from "biit-ui/navigation";
import {BiitInputTextModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule} from "biit-ui/button";



@NgModule({
  declarations: [
    UserFormComponent
  ],
  exports: [
    UserFormComponent
  ],
  imports: [
    CommonModule,
    BiitPopupModule,
    BiitTabGroupModule,
    BiitInputTextModule,
    FormsModule,
    TranslocoRootModule,
    BiitButtonModule
  ]
})
export class UserFormModule { }
