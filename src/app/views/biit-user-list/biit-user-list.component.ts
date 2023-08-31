import {Component, OnInit} from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData} from "biit-ui/table";
import {UserService} from "user-manager-structure-lib";
import {User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest, Observable} from "rxjs";
import {Constants} from "../../shared/constants";

@Component({
  selector: 'app-biit-user-list',
  templateUrl: './biit-user-list.component.html',
  styleUrls: ['./biit-user-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/userList', alias: 'users'}
    }
  ]
})
export class BiitUserListComponent implements OnInit {

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 0;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = BiitUserListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitUserListComponent.DEFAULT_PAGE_SIZE;
  protected users: User[];
  protected data: BiitTableData<User>;

  constructor(private userService: UserService, private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id', {}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('name', {}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('lastname', {}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('email', {}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('phone', {}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('accountLocked',{}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('accountBlocked',{}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('createdBy',{}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('createdAt',{}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('updatedBy',{}, {scope: 'components/userList', alias: 'users'}),
        this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/userList', alias: 'users'}),
      ]
    ).subscribe(([id, name, lastname, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("id", id, 50, undefined, false),
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("lastname", lastname, undefined, undefined, true),
        new BiitTableColumn("email", email, undefined, undefined, true),
        new BiitTableColumn("phone", phone, undefined, undefined, true),
        new BiitTableColumn("accountLocked", accountLocked, 200, undefined, true),
        new BiitTableColumn("accountBlocked", accountBlocked, 200, undefined, true),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, false),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, false),
        new BiitTableColumn("updatedBy", updatedBy, undefined, BiitTableColumnFormat.DATE, false),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, false),
      ];
      this.pageSize = BiitUserListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitUserListComponent.DEFAULT_PAGE;
      this.loadData();
    });


  }

  loadTranslations(): void {

  }

  private loadData(): void {
    this.userService.getAll().subscribe( {
      next: (users: User[]): void => {
        this.users = users.map(user => User.clone(user));
        this.nextData();
      }
    });
  }


  private nextData() {
    if (this.users.length > (this.page * this.pageSize)) {
      this.data = new BiitTableData(this.users.slice(this.page * this.pageSize, (this.page + 1) * this.pageSize), this.users.length);
    }
    console.log(this.data);
  }
}
