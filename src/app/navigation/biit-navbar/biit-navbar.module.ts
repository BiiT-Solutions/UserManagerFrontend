import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BiitNavbarComponent} from './biit-navbar.component';
import {BiitIconModule} from '@biit-solutions/wizardry-theme/icon';
import {BiitNavMenuModule, BiitNavUserModule} from '@biit-solutions/wizardry-theme/navigation';
import {ContextMenuModule} from '@perfectmemory/ngx-contextmenu'
import {TranslocoRootModule} from "@biit-solutions/wizardry-theme/i18n";
import {MapGetPipeModule} from "@biit-solutions/wizardry-theme/utils";

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
