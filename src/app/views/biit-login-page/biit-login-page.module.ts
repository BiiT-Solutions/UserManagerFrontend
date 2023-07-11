import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiitLoginPageComponent } from './biit-login-page.component';
import {BiitLoginModule} from "biit-ui/login";



@NgModule({
    declarations: [
        BiitLoginPageComponent
    ],
    exports: [
        BiitLoginPageComponent
    ],
  imports: [
    CommonModule,
    BiitLoginModule
  ]
})
export class BiitLoginPageModule { }
