import {Component, Input, OnInit} from '@angular/core';
import {
  Application,
  ApplicationRole, ApplicationRoleId,
  ApplicationRoleService,
  BackendServiceRole,
  Role, RoleService
} from "user-manager-structure-lib";
import {BiitTableColumn, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {combineLatest} from "rxjs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {GenericFilter} from "../utils/generic-filter";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";

@Component({
  selector: 'biit-application-roles-list',
  templateUrl: './application-roles-list.component.html',
  styleUrls: ['./application-roles-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/application_role_list', alias: 'application_roles'}
    }
  ]
})
export class ApplicationRolesListComponent implements OnInit {
  @Input() application: Application;
  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = ApplicationRolesListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = ApplicationRolesListComponent.DEFAULT_PAGE_SIZE;
  protected columns: BiitTableColumn[] = [];
  protected data: BiitTableData<ApplicationRole>;
  protected loading: boolean = false;
  private roles: ApplicationRole[];
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
        this.transloco.selectTranslate('name', {})
      ]
    ).subscribe(([name]) => {
      this.columns = [
        new BiitTableColumn("id.role.id", name, undefined, undefined, true)
      ];
      this.pageSize = ApplicationRolesListComponent.DEFAULT_PAGE_SIZE;
      this.page = ApplicationRolesListComponent.DEFAULT_PAGE;
      this.loadApplicationRoles();
      this.loadRoles();
    });

  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: roles => {
        this.allRoles = roles.map(Role.clone);
      }
    })
  }

  private loadApplicationRoles(): void {
    this.loading = true;
    if (!this.application || !this.application.id) {
      return;
    }
    this.applicationRoleService.getByApplicationName(this.application.id).subscribe({
      next: roles => {
        this.roles = roles.map(ApplicationRole.clone);
        this.nextData();
      }, complete: () => {
        this.loading = false;
      }
    });
  }

  private nextData(): void {
    if (this.roles.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize),
        this.roles.length);
    }
  }

  protected onAdd(): void {
    const ids: string[] = this.roles.map(role => role.id.role.id);
    this.availableRoles = this.allRoles.filter(role => !ids.includes(role.id));
    if (this.availableRoles.length) {
      this.applicationRole = new ApplicationRole();
      this.applicationRole.id = new ApplicationRoleId();
      this.applicationRole.id.application = this.application;
    } else {
      this.transloco.selectTranslate('no_roles_available', {},{scope: 'components/application_role_list', alias: 'roles'}).subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
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
            this.transloco.selectTranslate('request_completed_successfully', {}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
              }
            );
          }, error: (): void => {
            this.transloco.selectTranslate('request_unsuccessful', {}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
              }
            );
          }
        })
    }
  }
  protected onUpdatingItem(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const roles: ApplicationRole[] = this.roles.filter(serviceRole => GenericFilter.filter(serviceRole, tableResponse.search, true));
      this.data = new BiitTableData(roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), roles.length);
    } else {
      this.data = new BiitTableData(this.roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.roles.length);
    }
  }

  protected assignRole(): void {
    if (!this.applicationRole.id.role) {
      this.transloco.selectTranslate('no_role_selected', {},{scope: 'components/application_role_list', alias: 'roles'}).subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
        }
      );
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe({
        next: (): void => {
          this.loadApplicationRoles();
          this.applicationRole = null;
          this.transloco.selectTranslate('request_completed_successfully', {}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
            }
          );
        }, error: (): void => {
          this.transloco.selectTranslate('request_unsuccessful', {}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
            }
          );
        }
      })
    }
  }


  protected onAssign(applicationRoles: ApplicationRole[]): void {
    this.applicationRoleToAssign = applicationRoles[0];
  }
}
