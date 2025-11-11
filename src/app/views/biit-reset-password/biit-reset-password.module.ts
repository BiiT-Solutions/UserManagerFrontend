import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitResetPasswordComponent } from './biit-reset-password.component';
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";
import {BiitInputTextModule, BiitToggleModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitResetPasswordRoutingModule} from "./biit-reset-password-routing.module";


@NgModule({
  declarations: [
    BiitResetPasswordComponent
  ],
  imports: [
    BiitResetPasswordRoutingModule,
    CommonModule,
    BiitPopupModule,
    BiitIconModule,
    BiitInputTextModule,
    FormsModule,
    BiitToggleModule,
    BiitButtonModule,
    TranslocoRootModule
  ], exports: [
    BiitResetPasswordComponent
  ]
})
export class BiitResetPasswordModule { }
