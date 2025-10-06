import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope, TranslocoService} from '@ngneat/transloco';
import {Constants} from '../../shared/constants';
import {SessionService} from "user-manager-structure-lib";
import {ContextMenuComponent, ContextMenuService} from '@perfectmemory/ngx-contextmenu'
import {AuthGuard} from '../../services/auth-guard.service';
import {Permission} from "../../config/rbac/permission";
import {User} from "authorization-services-lib";
import {PermissionService} from "../../services/permission.service";

@Component({
  selector: 'biit-navbar',
  templateUrl: './biit-navbar.component.html',
  styleUrls: ['./biit-navbar.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/main', alias: 't'})]
})

export class BiitNavbarComponent implements AfterViewInit {
  protected readonly Constants = Constants;


  @ViewChild('contextMenu') contextMenu: ContextMenuComponent<void>;
  @ViewChild('navUser', {read: ElementRef}) navUser: ElementRef;
  routes: Route[] = [];
  user: User;

  constructor(private translocoService: TranslocoService,
              protected sessionService: SessionService,
              private permissionService: PermissionService,
              private contextMenuService: ContextMenuService<void>,
              protected router: Router) {
  }

  ngAfterViewInit() {
    this.setMenu();
  }

  private setMenu(): void {
    this.routes = [
      {
        path: Constants.PATHS.USERS,
        canActivate: [AuthGuard],
        title: 'users',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.USERS.VIEW)
        }
      },
      {
        path: Constants.PATHS.GROUPS,
        canActivate: [AuthGuard],
        title: 'groups',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.ROLE_GROUPS.VIEW)
        }
      },
      {
        path: Constants.PATHS.ROLES,
        canActivate: [AuthGuard],
        title: 'roles',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.ROLES.VIEW)
        }
      },
      {
        path: Constants.PATHS.APPLICATIONS,
        canActivate: [AuthGuard],
        title: 'applications',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.APPLICATIONS.VIEW)
        }
      },
      {
        path: Constants.PATHS.SERVICES,
        canActivate: [AuthGuard],
        title: 'services',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.SERVICES.VIEW)
        }
      },
      {
        path: Constants.PATHS.ORGANIZATIONS,
        canActivate: [AuthGuard],
        title: 'organizations',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.ORGANIZATIONS.VIEW)
        }
      },
      {
        path: Constants.PATHS.ORGANIZATION_TEAMS,
        canActivate: [AuthGuard],
        title: 'organization_teams',
        data: {
          hidden: !this.permissionService.hasPermission(Permission.ORGANIZATIONS_TEAMS.VIEW)
        }
      },
    ];
    this.routes.forEach(route => {
      this.translocoService.selectTranslate(route.title as string, {}, {scope: 'components/main'}).subscribe(value => route.title = value);

      route.children?.forEach(child => {
        this.translocoService.selectTranslate(child.title as string, {}, {scope: 'components/main'}).subscribe(value => child.title = value);
      })
    });
    this.user = this.sessionService.getUser();
  }

  protected onContextMenu($event: Event): void {
    this.contextMenuService.show(
      this.contextMenu,
      {
        x: this.navUser.nativeElement.offsetLeft + this.navUser.nativeElement.offsetWidth,
        y: this.navUser.nativeElement.offsetHeight
      }
    );
    $event.preventDefault();
    $event.stopPropagation();
  }
}
