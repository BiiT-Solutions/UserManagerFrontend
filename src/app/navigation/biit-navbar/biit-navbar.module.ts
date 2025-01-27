import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BiitNavbarComponent} from './biit-navbar.component';
import {BiitIconModule} from 'biit-ui/icon';
import {BiitNavMenuModule, BiitNavUserModule} from 'biit-ui/navigation';
import {ContextMenuModule} from '@perfectmemory/ngx-contextmenu'
import {TranslocoRootModule} from "biit-ui/i18n";
import {MapGetPipeModule} from "biit-ui/utils";

@NgModule({
  declarations: [BiitNavbarComponent],
  imports: [
    CommonModule,
    BiitIconModule,
    BiitNavMenuModule,
    BiitNavUserModule,
    ContextMenuModule,
    TranslocoRootModule,
    MapGetPipeModule
  ],
  exports: [BiitNavbarComponent],
})
export class BiitNavbarModule {
}
