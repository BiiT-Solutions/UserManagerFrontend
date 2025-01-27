import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitResetPasswordComponent } from './biit-reset-password.component';
import {BiitPopupModule} from "biit-ui/popup";
import {BiitIconModule} from "biit-ui/icon";
import {BiitInputTextModule, BiitToggleModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {BiitButtonModule} from "biit-ui/button";
import {TranslocoRootModule} from "biit-ui/i18n";
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
