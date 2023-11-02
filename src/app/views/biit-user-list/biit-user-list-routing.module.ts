import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitUserListComponent} from "./biit-user-list.component";
const routes: Routes = [
  {
    path: '',
    component: BiitUserListComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitUserListRoutingModule { }
