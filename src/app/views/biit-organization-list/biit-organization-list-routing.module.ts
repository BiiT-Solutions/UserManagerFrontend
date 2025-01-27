import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitOrganizationListComponent} from "./biit-organization-list.component";
const routes: Routes = [
  {
    path: '',
    component: BiitOrganizationListComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitOrganizationListRoutingModule { }
