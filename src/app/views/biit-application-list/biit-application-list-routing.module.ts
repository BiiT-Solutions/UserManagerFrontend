import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitApplicationListComponent} from "./biit-application-list.component";
const routes: Routes = [
  {
    path: '',
    component: BiitApplicationListComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitApplicationListRoutingModule { }
