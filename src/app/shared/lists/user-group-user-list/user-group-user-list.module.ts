import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { UserGroupUserListComponent } from './user-group-user-list.component';
import {FormsModule} from "@angular/forms";
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {UtilsModule} from "../../utils/utils.module";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";

@NgModule({
  declarations: [
    UserGroupUserListComponent
  ],
  exports: [
    UserGroupUserListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoRootModule,
    UtilsModule,
    BiitIconButtonModule,
    BiitButtonModule,
    BiitPopupModule,
    BiitDatatableModule,
    BiitIconModule
  ],
  providers: [
    DatePipe
  ]
})
export class UserGroupUserListModule { }
