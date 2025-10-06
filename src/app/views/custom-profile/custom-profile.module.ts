import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomProfileRoutingModule} from "./custom-profile-routing.module";
import {CustomProfileComponent} from "./custom-profile.component";
import {UserFormModule} from "../../shared/forms/user-form/user-form.module";
import {TranslocoModule} from "@ngneat/transloco";


@NgModule({
  declarations: [CustomProfileComponent],
  exports: [CustomProfileComponent],
  imports: [
    CommonModule,
    CustomProfileRoutingModule,
    UserFormModule,
    TranslocoModule,
  ]
})
export class CustomProfileModule {
}
