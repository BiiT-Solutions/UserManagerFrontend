import {Component, OnInit} from '@angular/core';
import {BackendService, BackendServiceService} from "@biit-solutions/user-manager-structure";
import {BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {DatatableColumn} from "@biit-solutions/wizardry-theme/table";
import {combineLatest, Observable} from "rxjs";
import {DatePipe} from "@angular/common";
import {ErrorHandler, InputLimits} from "@biit-solutions/wizardry-theme/utils";
import {Permission} from "../../config/rbac/permission";

@Component({
  selector: 'app-biit-service-list',
  templateUrl: './biit-service-list.component.html',
  styleUrls: ['./biit-service-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class BiitServiceListComponent implements OnInit {

  protected NAME_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected NAME_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected DESCRIPTION_MAX_LENGTH: number = InputLimits.MAX_BIG_FIELD_LENGTH;

  protected loading: boolean = false;
  protected columns: DatatableColumn[] = [];
  protected services: BackendService[];
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = 10;
  protected editService: BackendService;
  protected assignService: BackendService;
  protected mode: 'EDIT' | 'NEW' = 'NEW';
  protected confirm: null | 'DELETE';
  protected selected: BackendService[];

  constructor(private biitSnackbarService: BiitSnackbarService,
              protected transloco: TranslocoService,
              private _datePipe: DatePipe,
              private backendService: BackendServiceService) {
  }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('name', {}),
        this.transloco.selectTranslate('description'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([name, description, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(name, 'name'),
        new DatatableColumn(description, 'description'),
        new DatatableColumn(createdBy, 'createdBy', false),
        new DatatableColumn(createdAt, 'createdAt', undefined, undefined, undefined, this.datePipe()),
        new DatatableColumn(updatedBy, 'updatedBy', false),
        new DatatableColumn(updatedAt, 'updatedAt', false, undefined, undefined, this.datePipe())
      ];
      this.loadServices();
    });

  }

  private loadServices(): void {
    this.loading = true;
    this.backendService.getAll().subscribe({
      next: (services: BackendService[]): void => {
        this.services = services.map(BackendService.clone);
        this.services.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        });
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    }).add(() => this.loading = false);
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
      combineLatest(services.map(service => this.backendService.deleteById(service.name)))
        .subscribe({
          next: (): void => {
            this.loadServices();
            this.transloco.selectTranslate('request_success', {}, {scope: 'biit-ui/utils'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null);
              }
            );
          },
          error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
        });
    }
  }

  onEdit(selectedRows: BackendService[]) {
    if (selectedRows && selectedRows.length === 1) {
      this.editService = selectedRows[0];
      this.mode = 'EDIT';
    }
  }

  onSave(): void {
    const request: Observable<BackendService> = this.mode === "NEW" ? this.backendService.create(this.editService) :
      this.backendService.update(this.editService);

    request.subscribe({
      next: (): void => {
        this.editService = undefined;
        this.loadServices();
        let message: string;
        if (this.mode === "NEW") {
          message = 'request_success';
        } else {
          message = 'update_request_success';
        }
        this.transloco.selectTranslate(message, {}, {scope: 'biit-ui/utils'}).subscribe(
          translation => {
            this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null);
          }
        );
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    });
  }

  protected onAssign(selectedRows: BackendService[]): void {
    this.assignService = selectedRows[0];
  }

  protected readonly Permission = Permission;
}
