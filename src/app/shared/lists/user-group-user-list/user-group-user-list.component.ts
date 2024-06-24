import {Component, Input, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {SessionService, UserGroup, UserGroupService, UserService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {combineLatest} from "rxjs";
import {
  BiitTableColumn,
  BiitTableColumnFormat,
  BiitTableData,
  BiitTableResponse,
  GenericFilter,
  GenericSort
} from "biit-ui/table";
import {User} from "authorization-services-lib";
import {UserGroupUser} from "../../../models/user-group-user";

@Component({
  selector: 'biit-user-group-user-list',
  templateUrl: './user-group-user-list.component.html',
  styleUrls: ['./user-group-user-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/user_group_form', alias: 'form'}
    }
  ]
})
export class UserGroupUserListComponent implements OnInit {
  @Input() userGroup: UserGroup;

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = UserGroupUserListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = UserGroupUserListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected users: UserGroupUser[];
  protected data: BiitTableData<UserGroupUser>;

  protected loading: boolean = false;
  protected confirm: string;
  protected selected: UserGroupUser[];

  constructor(private userGroupService: UserGroupService,
              private userService: UserService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('lastname'),
        this.transloco.selectTranslate('assigned'),
        this.transloco.selectTranslate('username'),
        this.transloco.selectTranslate('email'),
        this.transloco.selectTranslate('phone',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('accountLocked',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('accountBlocked',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, lastname, assigned, username, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("id", id, 50, undefined, false),
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("lastname", lastname, undefined, undefined, true),
        new BiitTableColumn("assigned", assigned, undefined, BiitTableColumnFormat.ICON, true),
        new BiitTableColumn("username", username, undefined, undefined, false),
        new BiitTableColumn("email", email, undefined, undefined, false),
        new BiitTableColumn("phone", phone, undefined, undefined, false),
        new BiitTableColumn("accountLocked", accountLocked, undefined, BiitTableColumnFormat.BOOLEAN, false),
        new BiitTableColumn("accountBlocked", accountBlocked, undefined, BiitTableColumnFormat.BOOLEAN, false),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, false),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, false),
        new BiitTableColumn("updatedBy", updatedBy, undefined, undefined, false),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, false),
      ];
      this.pageSize = UserGroupUserListComponent.DEFAULT_PAGE_SIZE;
      this.page = UserGroupUserListComponent.DEFAULT_PAGE;
      this.loadData();
    });
  }

  private loadData(): void {
    this.loading = true;
    combineLatest(
      [
        this.userService.getAll(),
        this.userService.getByUserGroupId(this.userGroup.id)
      ]
    ).subscribe({
      next: (result: [users: User[], members: User[]]) => {
        const users = result[0];
        const members = result[1];

        this.users = users.map(user => UserGroupUser.clone(user as UserGroupUser));
        this.users.forEach(user => {
          members.some(m => m.id == user.id) ? user.assigned = "user_single" : user.assigned = undefined;
        });
        this.users.sort((a,b) => {
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
    if (this.users.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.users.length);
    } else if (this.users.length > 0) {
      this.page = Math.trunc(this.users.length / this.pageSize);
      this.data = new BiitTableData(this.users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.users.length);
    } else {
      this.data = new BiitTableData([], 0);
    }
  }

  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const users: UserGroupUser[] = this.users.filter(user => GenericFilter.filter(user, tableResponse.search, true));
      this.data = new BiitTableData(users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), users.length);
    } else {
      this.data = new BiitTableData(this.users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.users.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }

  protected onAssign(users: UserGroupUser[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'ASSIGN';
      this.selected = users;
    } else {
      this.confirm = null;
      this.userGroupService.addUsers(this.userGroup.id, users).subscribe({
        next: (): void => {
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
        }
      });

      this.selected = null;
    }
  }

  protected onRemove(users: UserGroupUser[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'REMOVE';
      this.selected = users;
    } else {
      this.confirm = null;
      this.userGroupService.removeUsers(this.userGroup.id, this.selected).subscribe({
        next: (): void => {
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
        }
      });

      this.selected = null;
    }
  }
}
