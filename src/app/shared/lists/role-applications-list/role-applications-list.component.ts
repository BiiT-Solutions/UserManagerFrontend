import {Component, Input, OnInit} from '@angular/core';
import {
  Application,
  ApplicationRole, ApplicationRoleId,
  ApplicationRoleService,
  ApplicationService,
  Role
} from "user-manager-structure-lib";
import {DatatableColumn} from "biit-ui/table";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'biit-role-applications-list',
  templateUrl: './role-applications-list.component.html',
  styleUrls: ['./role-applications-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class RoleApplicationsListComponent implements OnInit {

  @Input() role: Role;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = 10;
  protected columns: DatatableColumn[] = [];
  protected loading: boolean = false;
  protected applicationRoles: ApplicationRole[];
  protected selectedToDelete: ApplicationRole[];
  protected confirm: null | 'DELETE';
  protected applicationRole: ApplicationRole;
  protected allApplications: Application[];
  protected availableApplication: Application[];
  protected applicationRoleToAssign: ApplicationRole;

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
        new DatatableColumn(name, 'id.application.id')
      ];
      this.loadApplicationRoles();
      this.loadApplications();
    });
  }

  private loadApplications(): void {
    this.applicationService.getAll().subscribe({
      next: applications => {
        this.allApplications = applications.map(Application.clone);
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
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
        this.applicationRoles.sort((a,b) => {
          if ( a.id.application.id < b.id.application.id ){
            return -1;
          } else if ( a.id.application.id > b.id.application.id ){
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
    const ids: string[] = this.applicationRoles.map(role => role.id.application.id);
    this.availableApplication = this.allApplications.filter(role => !ids.includes(role.id));
    if (this.availableApplication.length) {
      this.applicationRole = new ApplicationRole();
      this.applicationRole.id = new ApplicationRoleId();
      this.applicationRole.id.role = this.role;
    } else {
      this.transloco.selectTranslate('no_applications_available').subscribe(
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
            this.transloco.selectTranslate('request_success', {}, {scope:'biit-ui/utils'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
              }
            );
          },
          error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
        })
    }
  }

  protected assignApplication(): void {
    if (!this.applicationRole.id.application) {
      this.transloco.selectTranslate('no_application_selected').subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
        }
      );
    } else {
      this.applicationRoleService.create(this.applicationRole).subscribe({
        next: (): void => {
          this.loadApplicationRoles();
          this.applicationRole = null;
          this.transloco.selectTranslate('request_success', {}, {scope:'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
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
