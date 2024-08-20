import {AfterViewInit, Component, OnInit, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {
  BiitTableColumn,
  BiitTableColumnFormat,
  BiitTableData,
  BiitTableResponse,
  DatatableColumn,
  GenericSort
} from "biit-ui/table";
import {SessionService, UserService} from "user-manager-structure-lib";
import {User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {GenericFilter} from "../../shared/utils/generic-filter";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-biit-user-list',
  templateUrl: './biit-user-list.component.html',
  styleUrls: ['./biit-user-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class BiitUserListComponent implements OnInit, AfterViewInit {
  @ViewChildren('booleanCell') booleanCell: QueryList<TemplateRef<any>>;

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
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
              private _datePipe: DatePipe,
              private transloco: TranslocoService) {
  }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('lastname'),
        this.transloco.selectTranslate('username'),
        this.transloco.selectTranslate('email'),
        this.transloco.selectTranslate('t.phone'),
        this.transloco.selectTranslate('t.accountLocked'),
        this.transloco.selectTranslate('t.accountBlocked'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, lastname, username, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(id, 'id', false, 80),
        new DatatableColumn(name, 'name'),
        new DatatableColumn(lastname, 'lastname'),
        new DatatableColumn(username, 'username'),
        new DatatableColumn(email, 'email'),
        new DatatableColumn(phone, 'phone', false),
        new DatatableColumn(accountLocked, 'accountLocked', false, 200, undefined, undefined, this.booleanCell.first),
        new DatatableColumn(accountBlocked, 'accountBlocked', false, 200, undefined, undefined, this.booleanCell.first),
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
    this.userService.getAll().subscribe( {
      next: (users: User[]): void => {
        this.users = users.map(user => User.clone(user));
        this.loading = false;
      }, error: (): void => {
        this.loading = false;
        this.transloco.selectTranslate('request_failed', {}, {scope:'biit-ui/utils'}).subscribe(msg => {
          this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
        });
      }
    });
  }

  protected onAdd(): void {
    this.target = new User();
  }

  protected onDelete(users: User[], confirmed: boolean): void {
    if (users.some(user => user.email === this.sessionService.getUser().email)) {
      this.biitSnackbarService.showNotification(this.transloco.translate('t.you_cannot_delete_yourself'), NotificationType.WARNING, null, 5);
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
          this.transloco.selectTranslate('request_success', {}, {scope: 'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
            }
          );
        }, error: (): void => {
            this.transloco.selectTranslate('request_failed', {}, {scope: 'biit-ui/utils'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.ERROR, null, 5);
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
    this.target = user[0];
  }

  protected onAssign(selectedRows: User[]): void {
    this.assign = selectedRows[0];
  }
}
