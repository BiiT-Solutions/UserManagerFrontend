import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitServiceListComponent} from "./biit-service-list.component";
const routes: Routes = [
  {
    path: '',
    component: BiitServiceListComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitServiceListRoutingModule { }
