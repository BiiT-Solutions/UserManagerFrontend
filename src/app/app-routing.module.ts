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
    path: 'users',
    loadChildren: () => import('./views/biit-user-list/biit-user-list.module').then(m => m.BiitUserListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./views/biit-role-list/biit-role-list.module').then(m => m.BiitRoleListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'applications',
    loadChildren: () => import('./views/biit-application-list/biit-application-list.module').then(m => m.BiitApplicationListModule),
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
