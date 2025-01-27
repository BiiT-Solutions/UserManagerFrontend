import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapGetPipe} from "./map-get.pipe";
import {SetHasPipe} from "./set-has.pipe";
import {HasRolePipe} from "./has-role.pipe";




@NgModule({
  declarations: [
    MapGetPipe,
    SetHasPipe,
    HasRolePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapGetPipe,
    SetHasPipe,
    HasRolePipe
  ]
})
export class UtilsModule { }
