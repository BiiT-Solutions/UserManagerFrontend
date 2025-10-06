import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormPopupComponent } from './user-form-popup.component';
import {BiitPopupModule} from "biit-ui/popup";
import {BiitTabGroupModule} from "biit-ui/navigation";
import {BiitDatePickerModule, BiitInputTextModule, BiitTextareaModule, BiitToggleModule} from "biit-ui/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "biit-ui/i18n";
import {BiitButtonModule} from "biit-ui/button";
import {UtilsModule} from "../../utils/utils.module";
import {UserFormModule} from "../../forms/user-form/user-form.module";

@NgModule({
  declarations: [
    UserFormPopupComponent
  ],
  exports: [
    UserFormPopupComponent
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
    BiitTextareaModule,
    BiitDatePickerModule,
    BiitToggleModule,
    UserFormModule
  ]
})
export class UserFormPopupModule { }
