import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Route, Router} from '@angular/router';
import {provideTranslocoScope, TranslocoService} from '@ngneat/transloco';
import {Constants} from '../../shared/constants';
import {SessionService} from "user-manager-structure-lib";
import {ContextMenuComponent, ContextMenuService} from '@perfectmemory/ngx-contextmenu'
import {combineLatest} from "rxjs";

@Component({
  selector: 'biit-navbar',
  templateUrl: './biit-navbar.component.html',
  styleUrls: ['./biit-navbar.component.scss'],
  providers: [provideTranslocoScope({scope: 'components/main', alias: 't'})]
})

export class BiitNavbarComponent implements AfterViewInit {
  @ViewChild('contextMenu') contextMenu: ContextMenuComponent<void>;
  @ViewChild('navUser', {read: ElementRef}) navUser: ElementRef;
  routes: Route[] = [];

  constructor(private translocoService: TranslocoService,
              protected sessionService: SessionService,
              private contextMenuService: ContextMenuService<void>,
              protected router: Router) {}

  ngAfterViewInit() {
    this.setMenu();
  }

  private setMenu(): void {
    this.routes = [];
    combineLatest([
      this.translocoService.selectTranslate('users', {},  {scope: 'components/main'}),
      this.translocoService.selectTranslate('groups', {},  {scope: 'components/main'}),
      this.translocoService.selectTranslate('roles', {},  {scope: 'components/main'}),
      this.translocoService.selectTranslate('applications', {},  {scope: 'components/main'}),
      this.translocoService.selectTranslate('services', {},  {scope: 'components/main'}),
      this.translocoService.selectTranslate('organizations', {},  {scope: 'components/main'})
    ]).subscribe({
      next: ([users, groups, roles, applications, services, organizations]) => {
        this.routes.push({path: Constants.PATHS.USERS, title: users});
        this.routes.push({path: Constants.PATHS.GROUPS, title: groups});
        this.routes.push({path: Constants.PATHS.ROLES, title: roles});
        this.routes.push({path: Constants.PATHS.APPLICATIONS, title: applications});
        this.routes.push({path: Constants.PATHS.SERVICES, title: services});
        this.routes.push({path: Constants.PATHS.ORGANIZATIONS, title: organizations});
      }
    });
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
