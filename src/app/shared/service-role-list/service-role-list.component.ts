import {Component, Input, OnInit} from '@angular/core';
import {BiitTableColumn, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {
  BackendService,
  BackendServiceRole,
  BackendServiceRoleId,
  BackendServiceRoleService
} from "user-manager-structure-lib";
import {combineLatest} from "rxjs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {GenericFilter} from "../utils/generic-filter";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";

@Component({
  selector: 'biit-service-role-list',
  templateUrl: './service-role-list.component.html',
  styleUrls: ['./service-role-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/role_form', alias: 'roles'}
    }
  ]
})
export class ServiceRoleListComponent implements OnInit {
  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = ServiceRoleListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = ServiceRoleListComponent.DEFAULT_PAGE_SIZE;
  protected columns: BiitTableColumn[] = [];
  protected data: BiitTableData<BackendServiceRole>;
  protected loading: boolean = false;
  protected role: string;
  protected confirm: null | 'DELETE';
  private serviceRoles: BackendServiceRole[];
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
        new BiitTableColumn("id.name", name, undefined, undefined, true)
      ];
      this.pageSize = ServiceRoleListComponent.DEFAULT_PAGE_SIZE;
      this.page = ServiceRoleListComponent.DEFAULT_PAGE;
      this.loadServiceRoles();
    });
  }

  private loadServiceRoles(): void {
    this.loading = true;
    this.backendServiceRoleService.getByBackendServiceName(this.service.name).subscribe({
      next: data => {
        this.serviceRoles = data.map(BackendServiceRole.clone);
        this.nextData();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    })
  }

  private nextData(): void {
    if (this.serviceRoles.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.serviceRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize),
        this.serviceRoles.length);
    }
  }

  protected onAdd(): void {
    this.role = '';
  }

  protected onDelete(serviceRoles: BackendServiceRole[], confirmed: boolean) {
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

  protected onSave(): void {
    const role: BackendServiceRole = new BackendServiceRole();
    role.id = new BackendServiceRoleId();
    role.id.name = this.role;
    role.id.backendService = this.service;
    this.backendServiceRoleService.create(role).subscribe({
      next: (value: BackendServiceRole): void => {
        this.loadServiceRoles();
      }, error: (): void => {

      }, complete: (): void => {
        this.role = undefined;
      }
    });
  }

  protected onUpdatingItem(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const serviceRoles: BackendServiceRole[] = this.serviceRoles.filter(serviceRole => GenericFilter.filter(serviceRole, tableResponse.search, true));
      this.data = new BiitTableData(serviceRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), serviceRoles.length);
    } else {
      this.data = new BiitTableData(this.serviceRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.serviceRoles.length);
    }
  }
}
