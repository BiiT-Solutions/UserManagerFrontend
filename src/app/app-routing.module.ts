import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./services/auth-guard.service";
import {Constants} from "./shared/constants";

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
    path: Constants.PATHS.USERS,
    loadChildren: () => import('./views/biit-user-list/biit-user-list.module').then(m => m.BiitUserListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.GROUPS,
    loadChildren: () => import('./views/biit-user-group-list/biit-user-group-list.module').then(m => m.BiitUserGroupListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.ROLES,
    loadChildren: () => import('./views/biit-role-list/biit-role-list.module').then(m => m.BiitRoleListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.APPLICATIONS,
    loadChildren: () => import('./views/biit-application-list/biit-application-list.module').then(m => m.BiitApplicationListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.SERVICES,
    loadChildren: () => import('./views/biit-service-list/biit-service-list.module').then(m => m.BiitServiceListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.ORGANIZATIONS,
    loadChildren: () => import('./views/biit-organization-list/biit-organization-list.module').then(m => m.BiitOrganizationListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.ORGANIZATION_TEAMS,
    loadChildren: () => import('./views/biit-team-list/biit-team-list.module').then(m => m.BiitTeamListModule),
    canActivate: [AuthGuard]
  },
  {
    path: Constants.PATHS.OWN_PROFILE,
    loadChildren: () => import('./views/custom-profile/custom-profile.module').then(m => m.CustomProfileModule),
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
export class AppRoutingModule {
}
