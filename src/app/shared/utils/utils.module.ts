import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MapGetPipe} from "./map-get.pipe";
import {SetHasPipe} from "./set-has.pipe";




@NgModule({
  declarations: [
    MapGetPipe,
    SetHasPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MapGetPipe,
    SetHasPipe
  ]
})
export class UtilsModule { }
