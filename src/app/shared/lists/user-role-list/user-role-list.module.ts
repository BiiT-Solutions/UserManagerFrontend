import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleListComponent } from './user-role-list.component';
import {BiitDatatableModule} from "@biit-solutions/wizardry-theme/table";
import {BiitButtonModule, BiitIconButtonModule} from "@biit-solutions/wizardry-theme/button";
import {TranslocoModule} from "@ngneat/transloco";
import {BiitPopupModule} from "@biit-solutions/wizardry-theme/popup";
import {BiitDropdownModule} from "@biit-solutions/wizardry-theme/inputs";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    UserRoleListComponent
  ],
  exports: [
    UserRoleListComponent
  ],
    imports: [
        CommonModule,
        BiitIconButtonModule,
        TranslocoModule,
        BiitButtonModule,
        BiitPopupModule,
        BiitDropdownModule,
        FormsModule,
        BiitDatatableModule
    ]
})
export class UserRoleListModule { }
