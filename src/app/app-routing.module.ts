import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";

const login = import('./views/biit-login-page/biit-login-page.module').then(m => m.BiitLoginPageModule);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => login
  },
  {
    path: 'login',
    loadChildren: () => login
  },
  {
    path: 'portal',
    loadChildren: () => import('./views/portal/portal.module').then(m => m.PortalModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => login
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
