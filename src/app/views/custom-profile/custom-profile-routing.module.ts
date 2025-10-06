import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CustomProfileComponent} from "./custom-profile.component";

const routes: Routes = [
  {
    path: '',
    component: CustomProfileComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomProfileRoutingModule {
}
