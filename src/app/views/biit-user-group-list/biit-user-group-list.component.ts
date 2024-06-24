import {Component, OnInit} from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse, GenericSort} from "biit-ui/table";
import {SessionService, UserGroup, UserGroupService} from "user-manager-structure-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {GenericFilter} from "../../shared/utils/generic-filter";

@Component({
  selector: 'app-biit-user-group-list',
  templateUrl: './biit-user-group-list.component.html',
  styleUrls: ['./biit-user-group-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/user_group_list', alias: 'userGroups'}
    }
  ]
})
export class BiitUserGroupListComponent implements OnInit {

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = BiitUserGroupListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitUserGroupListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected userGroups: UserGroup[];
  protected data: BiitTableData<UserGroup>;

  protected target: UserGroup;
  protected confirm: null | 'DELETE';
  protected selected: UserGroup[] = [];
  protected loading: boolean = false;

  protected assignAppRoles: UserGroup;
  protected assignUsers: UserGroup;

  constructor(private userGroupService: UserGroupService,
              private biitSnackbarService: BiitSnackbarService,
              private sessionService: SessionService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("id", id, 50, undefined, false),
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, false),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, true),
        new BiitTableColumn("updatedBy", updatedBy, undefined, undefined, false),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, true),
      ];
      this.pageSize = BiitUserGroupListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitUserGroupListComponent.DEFAULT_PAGE;
      this.loadData();
    });
  }

  private loadData(): void {
    this.loading = true;
    this.userGroupService.getAll().subscribe( {
      next: (userGroups: UserGroup[]): void => {
        this.userGroups = userGroups.map(userGroup => UserGroup.clone(userGroup));
        this.userGroups.sort((a,b) => {
          if ( a.name < b.name ){
            return -1;
          } else if ( a.name > b.name ){
            return 1;
          } else {
            return 0;
          }
        });
        this.nextData();
        this.loading = false;
      }, error: (): void => {
        this.loading = false;
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    });
  }


  private nextData() {
    if (this.userGroups.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.userGroups.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.userGroups.length);
    } else if (this.userGroups.length > 0) {
      this.page = Math.trunc(this.userGroups.length / this.pageSize);
      this.data = new BiitTableData(this.userGroups.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.userGroups.length);
    } else {
      this.data = new BiitTableData([], 0);
    }
  }

  protected onAdd(): void {
    this.target = new UserGroup();
  }

  protected onDelete(userGroups: UserGroup[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'DELETE';
      this.selected = userGroups;
    } else {
      this.confirm = null;
      combineLatest(userGroups.map(userGroup => this.userGroupService.delete(userGroup.id)))
        .subscribe({next: (): void => {
          this.loadData();
          this.transloco.selectTranslate('request_completed_successfully', {}, {scope: '', alias: 'userGroups'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
            }
          );
        }, error: (): void => {
            this.transloco.selectTranslate('request_unsuccessful', {}, {scope: '', alias: 'userGroups'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
              }
            );
        }});
    }
  }

  protected onSaved(userGroup: UserGroup): void {
    this.loadData();
    this.target = null;
  }

  onEdit(userGroups: UserGroup[]): void {
    if (userGroups && userGroups.length === 1) {
      this.target = userGroups[0];
    } else {
      this.transloco.selectTranslate('bad_implementation', {}, {scope: '', alias: 'userGroups'}).subscribe(
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
      const userGroups: UserGroup[] = this.userGroups.filter(user => GenericFilter.filter(user, tableResponse.search, true));
      this.data = new BiitTableData(userGroups.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), userGroups.length);
    } else {
      this.data = new BiitTableData(this.userGroups.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.userGroups.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }

  protected onAssignAppRoles(selectedRows: UserGroup[]): void {
    this.assignAppRoles = selectedRows[0];
  }

  protected onAssignUsers(selectedRows: UserGroup[]): void {
    this.assignUsers = selectedRows[0];
  }
}
