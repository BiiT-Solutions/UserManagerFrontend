import {Component, OnInit} from '@angular/core';
import {BackendService, BackendServiceService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {combineLatest, Observable} from "rxjs";
import {UserFormValidationFields} from "../../shared/validations/user-form/user-form-validation-fields";
import {User} from "authorization-services-lib";
import {GenericFilter} from "../../shared/utils/generic-filter";

@Component({
  selector: 'app-biit-service-list',
  templateUrl: './biit-service-list.component.html',
  styleUrls: ['./biit-service-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/service_list', alias: 'services'}
    }
  ]
})
export class BiitServiceListComponent implements OnInit {
  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected loading: boolean = false;
  protected columns: BiitTableColumn[] = [];
  protected data: BiitTableData<BackendService>;
  protected services: BackendService[];
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = BiitServiceListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitServiceListComponent.DEFAULT_PAGE_SIZE;
  protected editService: BackendService;
  protected assignService: BackendService;
  protected mode: 'EDIT' | 'NEW' = 'NEW';
  protected confirm: null | 'DELETE';
  protected selected: BackendService[];

  constructor(private biitSnackbarService: BiitSnackbarService,
              protected transloco: TranslocoService,
              private backendService: BackendServiceService) {
  }

  ngOnInit(): void {
    combineLatest(
        [
          this.transloco.selectTranslate('name', {}),
          this.transloco.selectTranslate('description', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('createdBy', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('createdAt', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('updatedBy', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/service_list', alias: 'roles'}),
        ]
    ).subscribe(([name, description, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("description", description, undefined, undefined, true),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, true),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, true),
        new BiitTableColumn("updatedBy", updatedBy, undefined, undefined, true),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, true),
      ];
      this.pageSize = BiitServiceListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitServiceListComponent.DEFAULT_PAGE;
      this.loadServices();
    });

  }

  private loadServices(): void {
    this.loading = true;
    this.backendService.getAll().subscribe({
      next: (services: BackendService[]): void => {
        this.services = services.map(BackendService.clone);
        this.nextData();
      }, error: (): void => {
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }, complete: (): void => {
          this.loading = false;
      }
    });
  }

  private nextData() {
    if (this.services.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.services.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize),
          this.services.length);
    }
  }


  onAdd() {
    this.editService = new BackendService();
    this.mode = 'NEW';
  }

  onDelete(services: BackendService[], confirmed: boolean) {
    if (!confirmed) {
      this.confirm = 'DELETE';
      this.selected = services;
    } else {
      this.confirm = null;
      combineLatest(services.map(service => this.backendService.deleteById(service.id)))
        .subscribe({next: (): void => {
            this.loadServices();
            this.transloco.selectTranslate('request_completed_successfully', {}, {scope: '', alias: 'users'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
              }
            );
          }, error: (): void => {
            this.transloco.selectTranslate('request_unsuccessful', {}, {scope: '', alias: 'users'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
              }
            );
          }});
    }
  }

  onEdit(selectedRows: BackendService[]) {
    if (selectedRows && selectedRows.length === 1) {
      this.editService = selectedRows[0];
      this.mode = 'EDIT';
    }
  }

  protected readonly UserFormValidationFields = UserFormValidationFields;

  onSave(): void {
    const request: Observable<BackendService> = this.mode === "NEW" ? this.backendService.create(this.editService) :
      this.backendService.update(this.editService);

    request.subscribe({
      next: (service: BackendService): void => {
        this.loadServices();
      }, error: (error: any): void => {
        this.biitSnackbarService.showNotification('error_saving', NotificationType.ERROR, null, 5);
        console.error(error);
      }
    });
  }

  protected onAssign(selectedRows: BackendService[]): void {
    this.assignService = selectedRows[0];
  }
  protected onUpdatingItem(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const services: BackendService[] = this.services.filter(service => GenericFilter.filter(service, tableResponse.search, true));
      this.data = new BiitTableData(services.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), services.length);
    } else {
      this.data = new BiitTableData(this.services.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.services.length);
    }
  }
}
