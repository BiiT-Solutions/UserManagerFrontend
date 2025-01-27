import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitUserGroupListComponent} from "./biit-user-group-list.component";
const routes: Routes = [
  {
    path: '',
    component: BiitUserGroupListComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitUserGroupListRoutingModule { }
