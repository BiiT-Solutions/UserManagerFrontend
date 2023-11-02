import { Component } from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse} from "biit-ui/table";
import {Role, RoleService, SessionService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {completeIconSet} from "biit-icons-collection";
import {BiitIconService} from "biit-ui/icon";

@Component({
  selector: 'app-biit-role-list',
  templateUrl: './biit-role-list.component.html',
  styleUrls: ['./biit-role-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/roles_list', alias: 'roles'}
    }
  ]
})
export class BiitRoleListComponent {

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = BiitRoleListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitRoleListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected roles: Role[];
  protected data: BiitTableData<Role>;

  protected target: Role;
  protected confirm: null | 'DELETE';
  protected selected: Role[] = [];
  protected loading: boolean = false;

  constructor(private roleService: RoleService,
              private biitSnackbarService: BiitSnackbarService,
              private biitIconService: BiitIconService,
              private sessionService: SessionService,
              private transloco: TranslocoService) {
    biitIconService.registerIcons(completeIconSet);
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id', {}, {scope: 'components/roles_list', alias: 'roles'}),
        this.transloco.selectTranslate('description', {}, {scope: 'components/roles_list', alias: 'roles'}),
        this.transloco.selectTranslate('createdBy', {}, {scope: 'components/roles_list', alias: 'roles'}),
        this.transloco.selectTranslate('createdAt', {}, {scope: 'components/roles_list', alias: 'roles'}),
        this.transloco.selectTranslate('updatedBy', {}, {scope: 'components/roles_list', alias: 'roles'}),
        this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/roles_list', alias: 'roles'}),
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
      this.pageSize = BiitRoleListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitRoleListComponent.DEFAULT_PAGE;
      this.loadData();
    });


  }

  private loadData(): void {
    this.loading = true;
    this.roleService.getAll().subscribe( {
      next: (roles: Role[]): void => {
        this.roles = roles.map(role => Role.clone(role));
        this.nextData();
        this.loading = false;
      }, error: (): void => {
        this.loading = false;
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    });
  }

  private nextData() {
    if (this.roles.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.roles.length);
    }
  }

  protected onAdd(): void {
    this.target = new Role();
  }

  protected onDelete(roles: Role[], confirmed: boolean): void {
  //   if (users.some(user => user.email === this.sessionService.getUser().email)) {
  //     this.transloco.selectTranslate('you_cannot_delete_yourself', {}, {scope: 'components/user_list', alias: 'users'})
  //       .subscribe(translation => {
  //         this.biitSnackbarService.showNotification(translation, NotificationType.WARNING, null, 5);
  //       });
  //     return;
  //   }
  //   if (!confirmed) {
  //     this.confirm = 'DELETE';
  //     this.selected = users;
  //   } else {
  //     this.confirm = null;
  //     combineLatest(users.map(user => this.userService.deleteByUserName(user.username)))
  //       .subscribe({next: (): void => {
  //           this.loadData();
  //           this.transloco.selectTranslate('request_completed_successfully', {}, {scope: 'components/user_list', alias: 'users'}).subscribe(
  //             translation => {
  //               this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
  //             }
  //           );
  //         }, error: (): void => {
  //           this.transloco.selectTranslate('request_unsuccessful', {}, {scope: 'components/user_list', alias: 'users'}).subscribe(
  //             translation => {
  //               this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
  //             }
  //           );
  //         }});
  //   }
  }

  protected onSaved(role: Role): void {
  //   this.loadData();
  //   this.target = null;
  }

  onEdit(roles: Role[]): void {
  //   if (user && user.length === 1) {
  //     this.target = user[0];
  //   } else {
  //     this.transloco.selectTranslate('bad_implementation', {}, {scope: 'components/user_list', alias: 'users'}).subscribe(
  //       translation => {
  //         this.biitSnackbarService.showNotification(translation.replace('${CODE}', 'ULC0'), NotificationType.ERROR, undefined, 10);
  //       }
  //     );
  //   }
  }

  protected onUpdatingTask(tableResponse: BiitTableResponse): void {
  //   this.pageSize = tableResponse.pageSize;
  //   this.page = tableResponse.currentPage;
  //   if (tableResponse.search && tableResponse.search.length) {
  //     const users: User[] = this.users.filter(user => GenericFilter.filter(user, tableResponse.search, true));
  //     this.data = new BiitTableData(users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), users.length);
  //   } else {
  //     this.data = new BiitTableData(this.users.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.users.length);
  //   }
  }
}
