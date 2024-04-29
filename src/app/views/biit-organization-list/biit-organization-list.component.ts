import {Component, OnInit} from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse, GenericSort} from "biit-ui/table";
import {Organization, OrganizationService, SessionService, UserService} from "user-manager-structure-lib";
import {User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {GenericFilter} from "../../shared/utils/generic-filter";

@Component({
  selector: 'app-biit-organization-list',
  templateUrl: './biit-organization-list.component.html',
  styleUrls: ['./biit-organization-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/organization', alias: 'org'}
    }
  ]
})
export class BiitOrganizationListComponent implements OnInit {

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = BiitOrganizationListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitOrganizationListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected organizations: Organization[];
  protected data: BiitTableData<Organization>;

  protected target: Organization;
  protected confirm: null | 'DELETE';
  protected selected: Organization[] = [];
  protected loading: boolean = false;

  protected manage: Organization;

  constructor(private organizationService: OrganizationService,
              private biitSnackbarService: BiitSnackbarService,
              private sessionService: SessionService,
              private transloco: TranslocoService) {
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
        new BiitTableColumn("id", id, 50, undefined, false),
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("description", description, undefined, undefined, true),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, false),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, true),
        new BiitTableColumn("updatedBy", updatedBy, undefined, undefined, false),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, false),
      ];
      this.pageSize = BiitOrganizationListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitOrganizationListComponent.DEFAULT_PAGE;
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
        this.nextData();
      }, error: (): void => {
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    }).add(() => {
      this.loading = false;
    });
  }


  private nextData() {
    if (this.organizations.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.organizations.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.organizations.length);
    }
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
      combineLatest(organizations.map(org => this.organizationService.deleteById(org.id)))
        .subscribe({next: (): void => {
          this.loadData();
          this.transloco.selectTranslate('request_completed_successfully', {}, {scope: '', alias: 'org'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
            }
          );
        }, error: (): void => {
            this.transloco.selectTranslate('request_unsuccessful', {}, {scope: '', alias: 'org'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
              }
            );
        }});
    }
  }

  protected onSaved(organization: Organization): void {
    this.loadData();
    this.target = null;
  }

  onEdit(organizations: Organization[]): void {
    if (organizations && organizations.length === 1) {
      this.target = organizations[0];
    } else {
      this.transloco.selectTranslate('bad_implementation', {}, {scope: 'components/organization', alias: 'org'}).subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation.replace('${CODE}', 'ULC0'), NotificationType.ERROR, undefined, 10);
        }
      );
    }
  }

  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const organizations: Organization[] = this.organizations.filter(org => GenericFilter.filter(org, tableResponse.search, true));
      this.data = new BiitTableData(organizations.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), organizations.length);
    } else {
      this.data = new BiitTableData(this.organizations.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.organizations.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }

  protected onManage(selectedRows: Organization[]): void {
    this.manage = selectedRows[0];
  }
}
