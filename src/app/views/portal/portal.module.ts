import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal.component';
import {PortalRoutingModule} from "./portal-routing.module";
import {BiitUserListModule} from "../biit-user-list/biit-user-list.module";



@NgModule({
  declarations: [
    PortalComponent
  ],
  imports: [
    PortalRoutingModule,
    CommonModule,
    BiitUserListModule
  ]
})
export class PortalModule { }
