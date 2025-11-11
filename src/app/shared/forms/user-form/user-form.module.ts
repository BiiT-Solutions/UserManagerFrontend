import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserFormComponent} from "./user-form.component";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitTabGroupModule} from "@biit-solutions/wizardry-theme/navigation";
import {BiitDatePickerModule, BiitInputTextModule, BiitTextareaModule, BiitToggleModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitButtonModule} from "@biit-solutions/wizardry-theme/button";
import {UtilsModule} from "../../utils/utils.module";


@NgModule({
  declarations: [UserFormComponent],
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
    BiitButtonModule,
    UtilsModule,
    BiitTextareaModule,
    BiitDatePickerModule,
    BiitToggleModule
  ]
})
export class UserFormModule {
}
