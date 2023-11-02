import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitServiceListComponent } from './biit-service-list.component';
import {BiitServiceListRoutingModule} from "./biit-service-list-routing.module";
import {BiitIconButtonModule} from "biit-ui/button";
import {BiitTableModule} from "biit-ui/table";
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
  declarations: [
    BiitServiceListComponent
  ],
    imports: [
        CommonModule,
        BiitServiceListRoutingModule,
        BiitIconButtonModule,
        BiitTableModule,
        TranslocoModule
    ]
})
export class BiitServiceListModule { }
