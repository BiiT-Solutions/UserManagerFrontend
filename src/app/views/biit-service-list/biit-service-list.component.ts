import {Component, OnInit} from '@angular/core';
import {BackendService, BackendServiceService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {User} from "authorization-services-lib";
import {BiitUserListComponent} from "../biit-user-list/biit-user-list.component";
import {combineLatest} from "rxjs";

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

  constructor(private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService,
              private backendService: BackendServiceService) {
  }

  ngOnInit(): void {
    combineLatest(
        [
          this.transloco.selectTranslate('id', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('description', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('createdBy', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('createdAt', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('updatedBy', {}, {scope: 'components/service_list', alias: 'roles'}),
          this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/service_list', alias: 'roles'}),
        ]
    ).subscribe(([id, description, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("id", id, undefined, undefined, true),
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
    })
  }

  private nextData() {
    if (this.services.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.services.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize),
          this.services.length);
    }
  }

  onUpdatingService(service: BiitTableResponse): void {

  }

  onAdd() {

  }

  onDelete(selectedRows: BackendService[], confirmed: boolean) {

  }

  onEdit(selectedRows: BackendService[]) {

  }
}
