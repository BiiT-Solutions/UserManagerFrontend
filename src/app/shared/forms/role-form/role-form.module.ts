import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoleFormComponent} from './role-form.component';
import {BiitPopupModule} from "biit-ui/popup";
import {BiitTabGroupModule} from "biit-ui/navigation";
import {BiitInputTextModule, BiitTextareaModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule} from "biit-ui/button";
import {UtilsModule} from "../../utils/utils.module";

@NgModule({
  declarations: [
    RoleFormComponent
  ],
  exports: [
    RoleFormComponent
  ],
  imports: [
    CommonModule,
    BiitPopupModule,
    BiitTabGroupModule,
    BiitInputTextModule,
    FormsModule,
    TranslocoRootModule,
    BiitButtonModule,
    UtilsModule,
    BiitTextareaModule
  ]
})
export class RoleFormModule { }
