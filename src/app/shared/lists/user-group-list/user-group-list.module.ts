import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { UserGroupListComponent } from './user-group-list.component';
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitDropdownModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";
import {BiitIconModule} from "@biit-solutions/wizardry-theme/icon";

@NgModule({
  declarations: [
    UserGroupListComponent
  ],
  exports: [
    UserGroupListComponent
  ],
  imports: [
    CommonModule,
    BiitIconButtonModule,
    TranslocoModule,
    BiitButtonModule,
    BiitPopupModule,
    BiitDropdownModule,
    FormsModule,
    BiitDatatableModule,
    BiitIconModule
  ],
  providers: [
    DatePipe
  ]
})
export class UserGroupListModule { }
