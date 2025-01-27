import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {BiitResetPasswordComponent} from "./biit-reset-password.component";
const routes: Routes = [
  {
    path: '',
    component: BiitResetPasswordComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiitResetPasswordRoutingModule { }
