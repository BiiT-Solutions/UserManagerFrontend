import {Component, Input, OnInit} from '@angular/core';
import {User} from "authorization-services-lib";
import {BiitTableColumn, BiitTableData, BiitTableResponse, GenericFilter, GenericSort} from "biit-ui/table";
import {combineLatest} from "rxjs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {
  Application,
  ApplicationRole,
  ApplicationRoleId,
  ApplicationRoleService, ApplicationService,
  Role,
  UserService
} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";

@Component({
  selector: 'biit-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/application_role_list', alias: 'application_roles'}
    }
  ]
})
export class UserRoleListComponent implements OnInit {

  @Input() user: User;

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = UserRoleListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = UserRoleListComponent.DEFAULT_PAGE_SIZE;
  protected columns: BiitTableColumn[] = [];
  protected loading: boolean = false;
  protected data: BiitTableData<ApplicationRole>;
  private roles: ApplicationRole[];
  protected selectedToDelete: ApplicationRole[];
  protected confirm: null | 'DELETE';
  protected applicationRole: ApplicationRole;
  protected allApplications: Application[];
  protected allApplicationRoles: Role[] = [];

  constructor(private applicationRoleService: ApplicationRoleService,
              private applicationService: ApplicationService,
              private userService: UserService,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('application', {}),
        this.transloco.selectTranslate('role', {})
      ]
    ).subscribe(([application, role]) => {
      this.columns = [
        new BiitTableColumn("id.application.id", application, undefined, undefined, true),
        new BiitTableColumn("id.role.id", role, undefined, undefined, true)
      ];
      this.pageSize = UserRoleListComponent.DEFAULT_PAGE_SIZE;
      this.page = UserRoleListComponent.DEFAULT_PAGE;
      this.loadRoles();
      this.loadApplications();
    });
  }

  private loadApplications(): void {
    this.applicationService.getAll().subscribe({
      next: applications => {
        this.allApplications = applications.map(Application.clone);
        this.allApplications.sort((a,b) => {
          if ( a.id < b.id ){
            return -1;
          } else if ( a.id > b.id ){
            return 1;
          } else {
            return 0;
          }
        });
      }
    });
  }

  protected loadApplicationRoles(application: Application): void {
    this.allApplicationRoles = [];
    this.applicationRoleService.getByApplicationName(application.id).subscribe({
      next: roles => {
        this.allApplicationRoles = roles
          .map(ApplicationRole.clone)
          .filter(applicationRole =>
            !this.roles.some(role =>
              role.id.application.id.toLowerCase() == applicationRole.id.application.id.toLowerCase() &&
              role.id.role.id.toLowerCase() == applicationRole.id.role.id.toLowerCase()
            )
          )
          .map(applicationRole => applicationRole.id.role)
          .sort((a,b) => {
            if ( a.id < b.id ){
              return -1;
            } else if ( a.id > b.id ){
              return 1;
            } else {
              return 0;
            }
        });
      }
    });
  }

  private loadRoles(): void {
    this.roles = [];
    this.data = new BiitTableData([], 0);
    this.loading = true;
    if (!this.user || !this.user.username) {
      return;
    }
    this.applicationRoleService.getByUsername(this.user.username).subscribe({
      next: roles => {
        this.roles = roles.map(ApplicationRole.clone);
        this.roles.sort((a,b) => {
          if ( a.id.application.id < b.id.application.id ){
            return -1;
          } else if ( a.id.application.id > b.id.application.id ){
            return 1;
          } else {
            return 0;
          }
        });
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
  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const roles: ApplicationRole[] = this.roles.filter(serviceRole => GenericFilter.filter(serviceRole, tableResponse.search, true));
      this.data = new BiitTableData(roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), roles.length);
    } else {
      this.data = new BiitTableData(this.roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.roles.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }

  protected onDelete(applicationRoles: ApplicationRole[], confirmed: boolean): void {
    if (!confirmed) {
      this.selectedToDelete = applicationRoles;
      this.confirm = 'DELETE';
    } else {
      this.confirm = null;
      combineLatest(applicationRoles
        .map(applicationRole => this.userService.deleteByUserNameAndApplicationNameAndRoleName(this.user.username, applicationRole.id.application.id, applicationRole.id.role.id)))
        .subscribe({
          next: (): void => {
            this.loadRoles();
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

  protected onAdd(): void {
    this.applicationRole = new ApplicationRole();
    this.applicationRole.id = new ApplicationRoleId()
  }

  protected assignRole(): void {
    if (!this.applicationRole.id.role) {
      this.transloco.selectTranslate('provide_required_fields').subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
        }
      );
      return;
    }
    this.userService.assignApplicationNameAndRoleNameToUser(this.user.username, this.applicationRole.id.application.id, this.applicationRole.id.role.id).subscribe({
      next: (): void => {
        this.loadRoles();
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
