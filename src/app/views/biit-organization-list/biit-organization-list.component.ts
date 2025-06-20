import {Component, OnInit} from '@angular/core';
import {DatatableColumn} from "biit-ui/table";
import {Organization, OrganizationService, SessionService} from "user-manager-structure-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {DatePipe} from "@angular/common";
import {ErrorHandler} from "biit-ui/utils";
import {Permission} from "../../config/rbac/permission";

@Component({
  selector: 'app-biit-organization-list',
  templateUrl: './biit-organization-list.component.html',
  styleUrls: ['./biit-organization-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class BiitOrganizationListComponent implements OnInit {

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected organizations: Organization[];

  protected target: Organization;
  protected confirm: null | 'DELETE';
  protected selected: Organization[] = [];
  protected loading: boolean = false;

  protected manage: Organization;

  constructor(private organizationService: OrganizationService,
              private biitSnackbarService: BiitSnackbarService,
              private sessionService: SessionService,
              private _datePipe: DatePipe,
              private transloco: TranslocoService) {
  }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('description'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, description, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(id, 'id', false),
        new DatatableColumn(name, 'name'),
        new DatatableColumn(description, 'description'),
        new DatatableColumn(createdBy, 'createdBy', false),
        new DatatableColumn(createdAt, 'createdAt', undefined, undefined, undefined, this.datePipe()),
        new DatatableColumn(updatedBy, 'updatedBy', false),
        new DatatableColumn(updatedAt, 'updatedAt', false, undefined, undefined, this.datePipe())
      ];
      this.loadData();
    });
  }

  private loadData(): void {
    this.loading = true;
    this.organizationService.getAll().subscribe( {
      next: (organizations: Organization[]): void => {
        this.organizations = organizations.map(org => Organization.clone(org));
        this.organizations.sort((a,b) => {
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
    }).add(() => this.loading = false);
  }

  protected onAdd(): void {
    this.target = new Organization();
  }

  protected onDelete(organizations: Organization[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'DELETE';
      this.selected = organizations;
    } else {
      this.confirm = null;
      combineLatest(organizations.map(org => this.organizationService.deleteById(org.id))).subscribe({
        next: (): void => {
          this.loadData();
            this.transloco.selectTranslate('request_success', {}, {scope: 'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS);
            }
          );
        },
        error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
      });
    }
  }

  protected onSaved(): void {
    this.loadData();
    this.target = null;
  }

  onEdit(organizations: Organization[]): void {
    this.target = organizations[0];
  }

  protected onManage(selectedRows: Organization[]): void {
    this.manage = selectedRows[0];
  }

    protected readonly Permission = Permission;
}
