import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitTeamListComponent} from "./biit-team-list.component";

const routes: Routes = [
  {
    path: '',
    component: BiitTeamListComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitTeamListRoutingModule {
}
