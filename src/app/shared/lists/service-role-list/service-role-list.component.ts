import {Component, Input, OnInit} from '@angular/core';
import {DatatableColumn} from "biit-ui/table";
import {
  BackendService,
  BackendServiceRole,
  BackendServiceRoleId,
  BackendServiceRoleService
} from "user-manager-structure-lib";
import {combineLatest} from "rxjs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'biit-service-role-list',
  templateUrl: './service-role-list.component.html',
  styleUrls: ['./service-role-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class ServiceRoleListComponent implements OnInit {
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = 10;
  protected columns: DatatableColumn[] = [];
  protected loading: boolean = false;
  protected role: string;
  protected confirm: null | 'DELETE';
  protected serviceRoles: BackendServiceRole[];
  protected selectedToDelete: BackendServiceRole[];

  @Input() service: BackendService;

  constructor(private backendServiceRoleService: BackendServiceRoleService,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('name', {})
      ]
    ).subscribe(([name]) => {
      this.columns = [
        new DatatableColumn(name, 'id.name')
      ];
      this.loadServiceRoles();
    });
  }

  private loadServiceRoles(): void {
    this.loading = true;
    this.backendServiceRoleService.getByBackendServiceName(this.service.name).subscribe({
      next: data => {
        this.serviceRoles = data.map(BackendServiceRole.clone);
        this.serviceRoles.sort((a, b) => {
          if (a.id.name < b.id.name) {
            return -1;
          } else if (a.id.name > b.id.name) {
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
    this.role = '';
  }

  protected onDelete(serviceRoles: BackendServiceRole[], confirmed: boolean): void {
    if (!confirmed) {
      this.selectedToDelete = serviceRoles;
      this.confirm = 'DELETE';
    } else {
      this.confirm = null;
      combineLatest(serviceRoles.map(serviceRole => this.backendServiceRoleService.delete(serviceRole.id.backendService.name, serviceRole.id.name)))
        .subscribe({
          next: (): void => {
            this.loadServiceRoles();
            this.transloco.selectTranslate('request_completed_successfully', {}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS);
              }
            );
          },
          error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
        })
    }
  }

  protected onSave(): void {
    const role: BackendServiceRole = new BackendServiceRole();
    if (this.role) {
      console.log(role)
      role.id = new BackendServiceRoleId();
      role.id.name = this.role;
      role.id.backendService = this.service;
      this.backendServiceRoleService.create(role).subscribe({
        next: (): void => {
          this.loadServiceRoles();
          this.transloco.selectTranslate('request_success', {}, {scope: 'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS);
            }
          );
        },
        error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService),
      }).add(() => this.role = undefined);
    }
  }
}
