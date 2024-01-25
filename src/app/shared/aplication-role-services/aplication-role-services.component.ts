import {Component, Input, OnInit} from '@angular/core';
import {
  Application,
  ApplicationBackendServiceRole, ApplicationBackendServiceRoleId, ApplicationBackendServiceRoleService,
  ApplicationRole, ApplicationRoleId,
  ApplicationRoleService,
  ApplicationService, BackendService,
  BackendServiceRole, BackendServiceRoleId, BackendServiceRoleService, BackendServiceService, Role, UserService
} from "user-manager-structure-lib";
import {BiitTableColumn, BiitTableData, BiitTableResponse, GenericSort} from "biit-ui/table";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {GenericFilter} from "../utils/generic-filter";

@Component({
  selector: 'biit-aplication-role-services',
  templateUrl: './aplication-role-services.component.html',
  styleUrls: ['./aplication-role-services.component.scss']
})
export class AplicationRoleServicesComponent implements OnInit{

  @Input() applicationRole: ApplicationRole;

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;
  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = AplicationRoleServicesComponent.DEFAULT_PAGE_SIZE;
  protected page: number = AplicationRoleServicesComponent.DEFAULT_PAGE_SIZE;
  protected serviceRoles: BackendServiceRole[];
  protected columns: BiitTableColumn[] = [];
  protected loading: boolean = false;
  protected data: BiitTableData<BackendServiceRole>;
  protected confirm: null | 'DELETE';
  protected applicationBackendServiceRole: ApplicationBackendServiceRole;

  protected allServices: BackendService[];
  protected allServiceRoles: BackendServiceRoleId[]=[];
  protected selectedService: BackendService;
  protected selectedServiceRole: BackendServiceRoleId;
  protected selectedToDelete: BackendServiceRole[];

  constructor(private serviceRoleService: BackendServiceRoleService,
              private serviceService: BackendServiceService,
              private applicationServiceRolService: ApplicationBackendServiceRoleService,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }
  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('service', {}),
        this.transloco.selectTranslate('role', {})
      ]
    ).subscribe(([service, role]) => {
      this.columns = [
        new BiitTableColumn("id.backendService.name", service, undefined, undefined, true),
        new BiitTableColumn("id.name", role, undefined, undefined, true)
      ];
      this.pageSize = AplicationRoleServicesComponent.DEFAULT_PAGE_SIZE;
      this.page = AplicationRoleServicesComponent.DEFAULT_PAGE;
      this.loadServices();
      this.loadData();
    });
  }

  private loadData() {
    this.loading = true;
    this.serviceRoles = [];
    this.data = new BiitTableData(this.serviceRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize),
      this.serviceRoles.length);
    this.serviceRoleService.getByApplicationNameAndRoleName(this.applicationRole.id.application.id, this.applicationRole.id.role.id).subscribe({
      next: serviceRoles => {
        this.serviceRoles = serviceRoles.map(BackendServiceRole.clone);
        this.serviceRoles.sort((a,b) => {
          if ( a.id.backendService.name < b.id.backendService.name ){
            return -1;
          } else if ( a.id.backendService.name > b.id.backendService.name ){
            return 1;
          } else {
            return 0;
          }
        });
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

  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const roles: BackendServiceRole[] = this.serviceRoles.filter(serviceRole => GenericFilter.filter(serviceRole, tableResponse.search, true));
      this.data = new BiitTableData(roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), roles.length);
    } else {
      this.data = new BiitTableData(this.serviceRoles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.serviceRoles.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }

  protected loadServices(): void {
    this.serviceService.getAll().subscribe({
      next: services => {
        this.allServices = services.map(BackendService.clone);
      }
    })
  }

  protected assignRole(): void {
    if (!this.selectedService || !this.selectedServiceRole) {
      this.transloco.selectTranslate('provide_required_fields').subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
        }
      );
      return;
    }
    this.applicationBackendServiceRole.id.applicationRole.id.role.id = this.applicationRole.id.role.id;
    this.applicationBackendServiceRole.id.applicationRole.id.application.id = this.applicationRole.id.application.id;
    this.applicationBackendServiceRole.id.backendServiceRole.id.name = this.selectedServiceRole.name;
    this.applicationBackendServiceRole.id.backendServiceRole.id.backendService.name = this.selectedService.name;

    this.applicationServiceRolService.create(this.applicationBackendServiceRole).subscribe({
      next: () => {
        this.loadData();
        this.applicationBackendServiceRole = null;
        this.transloco.selectTranslate('request_completed_successfully', {}).subscribe(
          translation => {
            this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
          }
        );
      },
      error: () => {
        this.transloco.selectTranslate('request_unsuccessful', {}).subscribe(
          translation => {
            this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
          }
        );
      }
    })

  }
  protected loadServiceRoles(service: BackendService): void {
    this.serviceRoleService.getByBackendServiceName(service.name).subscribe({
      next: serviceRoles => {
        this.allServiceRoles = serviceRoles.map(BackendServiceRole.clone).map(bsr => bsr.id);
      }
    })
  }

  protected onAdd(): void {
    this.applicationBackendServiceRole = new ApplicationBackendServiceRole();
    this.applicationBackendServiceRole.id = new ApplicationBackendServiceRoleId();
    this.applicationBackendServiceRole.id.backendServiceRole = new BackendServiceRole();
    this.applicationBackendServiceRole.id.backendServiceRole.id = new BackendServiceRoleId();
    this.applicationBackendServiceRole.id.backendServiceRole.id.backendService = new BackendService();
    this.applicationBackendServiceRole.id.applicationRole = new ApplicationRole();
    this.applicationBackendServiceRole.id.applicationRole.id = new ApplicationRoleId()
    this.applicationBackendServiceRole.id.applicationRole.id.application = new Application();
    this.applicationBackendServiceRole.id.applicationRole.id.role = new Role();
  }

  protected onDelete(serviceRoles: BackendServiceRole[], confirmed: boolean): void {
    if (!confirmed) {
      this.selectedToDelete = serviceRoles;
      this.confirm = 'DELETE';
    } else {
      this.confirm = null;
      combineLatest(serviceRoles
        .map(serviceRole => this.applicationServiceRolService
          .deleteByApplicationNameAndApplicationRoleNameAndBackendServiceNameAndBackendServiceRoleName
          (this.applicationRole.id.application.id, this.applicationRole.id.role.id, serviceRole.id.backendService.name, serviceRole.id.name)))
        .subscribe({
          next: (): void => {
            this.loadData();
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
