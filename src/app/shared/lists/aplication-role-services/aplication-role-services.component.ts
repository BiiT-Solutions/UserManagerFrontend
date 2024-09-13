import {Component, Input, OnInit} from '@angular/core';
import {
  Application,
  ApplicationBackendServiceRole, ApplicationBackendServiceRoleId, ApplicationBackendServiceRoleService,
  ApplicationRole, ApplicationRoleId, BackendService,
  BackendServiceRole, BackendServiceRoleId, BackendServiceRoleService, BackendServiceService, Role
} from "user-manager-structure-lib";
import {
  DatatableColumn
} from "biit-ui/table";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'biit-aplication-role-services',
  templateUrl: './aplication-role-services.component.html',
  styleUrls: ['./aplication-role-services.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class AplicationRoleServicesComponent implements OnInit{

  @Input() applicationRole: ApplicationRole;

  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = 10;
  protected serviceRoles: BackendServiceRole[];
  protected columns: DatatableColumn[] = [];
  protected loading: boolean = false;
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
        new DatatableColumn(service, 'id.backendService.name'),
        new DatatableColumn(role, 'id.name')
      ];
      this.loadServices();
      this.loadData();
    });
  }

  private loadData() {
    this.loading = true;
    this.serviceRoles = [];
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
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    }).add(() => this.loading = false);
  }

  protected loadServices(): void {
    this.serviceService.getAll().subscribe({
      next: services => {
        this.allServices = services.map(BackendService.clone);
        this.allServices.sort((a,b) => {
          if ( a.name < b.name ){
            return -1;
          } else if ( a.name > b.name ){
            return 1;
          } else {
            return 0;
          }
        });
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
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
        this.transloco.selectTranslate('request_success', {}, {scope:'biit-ui/utils'}).subscribe(
          translation => {
            this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
          }
        );
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    })

  }
  protected loadServiceRoles(service: BackendService): void {
    this.serviceRoleService.getByBackendServiceName(service.name).subscribe({
      next: serviceRoles => {
        this.allServiceRoles = serviceRoles.map(BackendServiceRole.clone).map(bsr => bsr.id);
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
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
}
