import {Component, Input, OnInit} from '@angular/core';
import {
  Application,
  ApplicationRole, ApplicationRoleId,
  ApplicationRoleService,
  Role, RoleService
} from "user-manager-structure-lib";
import {DatatableColumn} from "biit-ui/table";
import {combineLatest} from "rxjs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'biit-application-roles-list',
  templateUrl: './application-roles-list.component.html',
  styleUrls: ['./application-roles-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class ApplicationRolesListComponent implements OnInit {
  @Input() application: Application;

  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = 10;
  protected columns: DatatableColumn[] = [];
  protected loading: boolean = false;
  protected roles: ApplicationRole[];
  protected selectedToDelete: ApplicationRole[];
  protected confirm: null | 'DELETE';
  protected applicationRole: ApplicationRole;
  protected allRoles: Role[];
  protected availableRoles: Role[];
  protected applicationRoleToAssign: ApplicationRole;

  constructor(private applicationRoleService: ApplicationRoleService,
              private biitSnackbarService: BiitSnackbarService,
              private roleService: RoleService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('name')
      ]
    ).subscribe(([name]) => {
      this.columns = [
        new DatatableColumn(name, 'id.role.id', name)
      ];
      this.loadApplicationRoles();
      this.loadRoles();
    });

  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: roles => {
        this.allRoles = roles.map(Role.clone);
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    });
  }

  private loadApplicationRoles(): void {
    this.loading = true;
    if (!this.application || !this.application.id) {
      return;
    }
    this.applicationRoleService.getByApplicationName(this.application.id).subscribe({
      next: roles => {
        this.roles = roles.map(ApplicationRole.clone);
        this.roles.sort((a,b) => {
          if ( a.id.role.id < b.id.role.id ){
            return -1;
          } else if ( a.id.role.id > b.id.role.id ){
            return 1;
          } else {
            return 0;
          }
        });
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    }).add(() => this.loading = false);
  }

  protected onAdd(): void {
    const ids: string[] = this.roles.map(role => role.id.role.id);
    this.availableRoles = this.allRoles.filter(role => !ids.includes(role.id)).sort((a, b) => {
      if (a.uniqueName < b.uniqueName) {
        return -1;
      } else if (a.uniqueName > b.uniqueName) {
        return 1;
      } else {
        return 0;
      }
    });
    if (this.availableRoles.length) {
      this.applicationRole = new ApplicationRole();
      this.applicationRole.id = new ApplicationRoleId();
      this.applicationRole.id.application = this.application;
    } else {
      this.transloco.selectTranslate('no_roles_available').subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR);
        }
      );
    }
  }

  protected onDelete(applicationRoles: ApplicationRole[], confirmed: boolean): void {
    if (!confirmed) {
      this.selectedToDelete = applicationRoles;
      this.confirm = 'DELETE';
    } else {
      this.confirm = null;
      combineLatest(applicationRoles.map(applicationRole => this.applicationRoleService.deleteByApplicationAndRole(applicationRole.id.application.id, applicationRole.id.role.id)))
        .subscribe({
          next: (): void => {
            this.loadApplicationRoles();
            this.transloco.selectTranslate('request_success', {}, {scope:'biit-ui/utils'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS);
              }
            );
          },
          error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
        })
    }
  }

  protected assignRole(): void {
    if (!this.applicationRole.id.role) {
      this.transloco.selectTranslate('no_role_selected').subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR);
        }
      );
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe({
        next: (): void => {
          this.loadApplicationRoles();
          this.applicationRole = null;
          this.transloco.selectTranslate('request_success', {}, {scope:'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS);
            }
          );
        },
        error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
      })
    }
  }


  protected onAssign(applicationRoles: ApplicationRole[]): void {
    this.applicationRoleToAssign = applicationRoles[0];
  }
}
