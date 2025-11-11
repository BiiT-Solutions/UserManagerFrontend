import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RoleFormComponent} from './role-form.component';
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitTabGroupModule} from "@biit-solutions/wizardry-theme/navigation";
import {BiitInputTextModule, BiitTextareaModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
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
