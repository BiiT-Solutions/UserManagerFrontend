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
    path: 'reset_password',
    loadChildren: () => import('./views/biit-reset-password/biit-reset-password.module').then(m => m.BiitResetPasswordModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./views/biit-user-list/biit-user-list.module').then(m => m.BiitUserListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'groups',
    loadChildren: () => import('./views/biit-user-group-list/biit-user-group-list.module').then(m => m.BiitUserGroupListModule),
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
    path: 'services',
    loadChildren: () => import('./views/biit-service-list/biit-service-list.module').then(m => m.BiitServiceListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'organizations',
    loadChildren: () => import('./views/biit-organization-list/biit-organization-list.module').then(m => m.BiitOrganizationListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'teams',
    loadChildren: () => import('./views/biit-team-list/biit-team-list.module').then(m => m.BiitTeamListModule),
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
