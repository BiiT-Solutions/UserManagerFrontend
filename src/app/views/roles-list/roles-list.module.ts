import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesListComponent } from './roles-list.component';
import {RolesListRoutingModule} from "./roles-list-routing.module";

@NgModule({
  declarations: [
    RolesListComponent
  ],
  imports: [
    CommonModule,
    RolesListRoutingModule
  ]
})
export class RolesListModule { }
