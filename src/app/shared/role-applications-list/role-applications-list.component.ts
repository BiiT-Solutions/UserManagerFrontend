import {Component, Input, OnInit} from '@angular/core';
import {
  Application,
  ApplicationRole, ApplicationRoleId,
  ApplicationRoleService,
  ApplicationService,
  Role,
  RoleService
} from "user-manager-structure-lib";
import {BiitTableColumn, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {GenericFilter} from "../utils/generic-filter";

@Component({
  selector: 'biit-role-applications-list',
  templateUrl: './role-applications-list.component.html',
  styleUrls: ['./role-applications-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/application_role_list', alias: 'application_roles'}
    }
  ]
})
export class RoleApplicationsListComponent implements OnInit {

  @Input() role: Role;
  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = RoleApplicationsListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = RoleApplicationsListComponent.DEFAULT_PAGE_SIZE;
  protected columns: BiitTableColumn[] = [];
  protected data: BiitTableData<ApplicationRole>;
  protected loading: boolean = false;
  private applicationRoles: ApplicationRole[];
  protected selectedToDelete: ApplicationRole[];
  protected confirm: null | 'DELETE';
  protected applicationRole: ApplicationRole;
  protected allApplications: Application[];
  protected availableApplication: Application[];

  constructor(private applicationRoleService: ApplicationRoleService,
              private biitSnackbarService: BiitSnackbarService,
              private applicationService: ApplicationService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('name', {})
      ]
    ).subscribe(([name]) => {
      this.columns = [
        new BiitTableColumn("id.application.id", name, undefined, undefined, true)
      ];
      this.pageSize = RoleApplicationsListComponent.DEFAULT_PAGE_SIZE;
      this.page = RoleApplicationsListComponent.DEFAULT_PAGE;
      this.loadApplicationRoles();
      this.loadApplications();
    });
  }

  private loadApplications(): void {
    this.applicationService.getAll().subscribe({
      next: applications => {
        this.allApplications = applications.map(Application.clone);
      }
    })
  }

  private loadApplicationRoles(): void {
    this.loading = true;
    if (!this.role || !this.role.id) {
      return;
    }
    this.applicationRoleService.getByRoleName(this.role.id).subscribe({
      next: roles => {
        this.applicationRoles = roles.map(ApplicationRole.clone);
        this.nextData();
      }, complete: () => {
        this.loading = false;
      }
    });
  }

  private nextData(): void {
    if (this.applicationRoles.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.applicationRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize),
        this.applicationRoles.length);
    }
  }

  protected onAdd(): void {
    const ids: string[] = this.applicationRoles.map(role => role.id.application.id);
    this.availableApplication = this.allApplications.filter(role => !ids.includes(role.id));
    if (this.availableApplication.length) {
      this.applicationRole = new ApplicationRole();
      this.applicationRole.id = new ApplicationRoleId();
      this.applicationRole.id.role = this.role;
    } else {
      this.transloco.selectTranslate('no_applications_available', {},{scope: 'components/application_role_list', alias: 'roles'}).subscribe(
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
      const roles: ApplicationRole[] = this.applicationRoles.filter(serviceRole => GenericFilter.filter(serviceRole, tableResponse.search, true));
      this.data = new BiitTableData(roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), roles.length);
    } else {
      this.data = new BiitTableData(this.applicationRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.applicationRoles.length);
    }
  }
  protected assignApplication(): void {
    if (!this.applicationRole.id.application) {
      this.transloco.selectTranslate('no_application_selected', {},{scope: 'components/application_role_list', alias: 'roles'}).subscribe(
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

}
