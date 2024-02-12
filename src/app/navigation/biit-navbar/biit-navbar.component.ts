import {Component, OnInit} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope, TranslocoService} from '@ngneat/transloco';
import {Constants} from '../../shared/constants';
import {SessionService} from "user-manager-structure-lib";

@Component({
  selector: 'biit-navbar',
  templateUrl: './biit-navbar.component.html',
  styleUrls: ['./biit-navbar.component.scss'],
  providers: [provideTranslocoScope('navigation')]
})

export class BiitNavbarComponent implements OnInit {
  constructor(private translocoService: TranslocoService,
              protected sessionService: SessionService,
              protected router: Router) {}

  routes: Route[] = [];

  ngOnInit() {
    this.setMenu();
  }

  private setMenu(): void {
    this.routes = [];
    this.translocoService.selectTranslate('users', {},  {scope: 'components/main'}).subscribe(msg => {
      this.routes.push({path: Constants.PATHS.USERS, title: msg});
    });
    this.translocoService.selectTranslate('groups', {},  {scope: 'components/main'}).subscribe(msg => {
      this.routes.push({path: Constants.PATHS.GROUPS, title: msg});
    });
    this.translocoService.selectTranslate('roles', {},  {scope: 'components/main'}).subscribe(msg => {
      this.routes.push({path: Constants.PATHS.ROLES, title: msg});
    });
    this.translocoService.selectTranslate('applications', {},  {scope: 'components/main'}).subscribe(msg => {
      this.routes.push({path: Constants.PATHS.APPLICATIONS, title: msg});
    });
    this.translocoService.selectTranslate('services', {},  {scope: 'components/main'}).subscribe(msg => {
      this.routes.push({path: Constants.PATHS.SERVICES, title: msg});
    });
  }
}
