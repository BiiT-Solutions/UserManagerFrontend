import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoleListComponent } from './service-role-list.component';
import {BiitPopupModule} from "biit-ui/popup";



@NgModule({
  declarations: [
    ServiceRoleListComponent
  ],
  exports: [
    ServiceRoleListComponent
  ],
  imports: [
    CommonModule,
    BiitPopupModule
  ]
})
export class ServiceRoleListModule { }
