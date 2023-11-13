import {Component, OnInit} from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {SessionService, UserService} from "user-manager-structure-lib";
import {User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {GenericFilter} from "../../shared/utils/generic-filter";

@Component({
  selector: 'app-biit-user-list',
  templateUrl: './biit-user-list.component.html',
  styleUrls: ['./biit-user-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/user_list', alias: 'users'}
    }
  ]
})
export class BiitUserListComponent implements OnInit {

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = BiitUserListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitUserListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected users: User[];
  protected data: BiitTableData<User>;

  protected target: User;
  protected confirm: null | 'DELETE';
  protected selected: User[] = [];
  protected loading: boolean = false;

  protected assign: User;

  constructor(private userService: UserService,
              private biitSnackbarService: BiitSnackbarService,
              private sessionService: SessionService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id', {}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('name', {}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('lastname', {}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('email', {}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('phone', {}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('accountLocked',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('accountBlocked',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('createdBy',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('createdAt',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('updatedBy',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/user_list', alias: 'users'}),
      ]
    ).subscribe(([id, name, lastname, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("id", id, 50, undefined, false),
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("lastname", lastname, undefined, undefined, true),
        new BiitTableColumn("email", email, undefined, undefined, true),
        new BiitTableColumn("phone", phone, undefined, undefined, false),
        new BiitTableColumn("accountLocked", accountLocked, undefined, BiitTableColumnFormat.BOOLEAN, true),
        new BiitTableColumn("accountBlocked", accountBlocked, undefined, BiitTableColumnFormat.BOOLEAN, true),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, false),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, false),
        new BiitTableColumn("updatedBy", updatedBy, undefined, undefined, false),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, false),
      ];
      this.pageSize = BiitUserListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitUserListComponent.DEFAULT_PAGE;
      this.loadData();
    });


  }

  private loadData(): void {
    this.loading = true;
    this.userService.getAll().subscribe( {
      next: (users: User[]): void => {
        this.users = users.map(user => User.clone(user));
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
    }
  }

  protected onAdd(): void {
    this.target = new User();
  }

  protected onDelete(users: User[], confirmed: boolean): void {
    if (users.some(user => user.email === this.sessionService.getUser().email)) {
      this.transloco.selectTranslate('you_cannot_delete_yourself', {}, {scope: '', alias: 'users'})
        .subscribe(translation => {
          this.biitSnackbarService.showNotification(translation, NotificationType.WARNING, null, 5);
        });
      return;
    }
    if (!confirmed) {
      this.confirm = 'DELETE';
      this.selected = users;
    } else {
      this.confirm = null;
      combineLatest(users.map(user => this.userService.deleteByUserName(user.username)))
        .subscribe({next: (): void => {
          this.loadData();
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

  protected onSaved(user: User): void {
    this.loadData();
    this.target = null;
  }

  onEdit(user: User[]): void {
    if (user && user.length === 1) {
      this.target = user[0];
    } else {
      this.transloco.selectTranslate('bad_implementation', {}, {scope: 'components/user_list', alias: 'users'}).subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation.replace('${CODE}', 'ULC0'), NotificationType.ERROR, undefined, 10);
        }
      );
    }
  }

  protected onUpdatingTask(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const users: User[] = this.users.filter(user => GenericFilter.filter(user, tableResponse.search, true));
      this.data = new BiitTableData(users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), users.length);
    } else {
      this.data = new BiitTableData(this.users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.users.length);
    }
  }

  protected onAssign(selectedRows: User[]): void {
    this.assign = selectedRows[0];
  }
}
