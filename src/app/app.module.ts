import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BiitLoginPageModule} from "./views/biit-login-page/biit-login-page.module";
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from 'biit-ui/i18n';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BiitLoginPageModule,
    HttpClientModule,
    TranslocoRootModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
