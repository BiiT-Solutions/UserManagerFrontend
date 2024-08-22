import {
  Component,
  Input,
  AfterViewInit,
  QueryList,
  TemplateRef,
  ViewChildren,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {SessionService, UserGroup, UserGroupService, UserService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {combineLatest} from "rxjs";
import {DatatableColumn} from "biit-ui/table";
import {User} from "authorization-services-lib";
import {UserGroupUser} from "../../../models/user-group-user";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'biit-user-group-user-list',
  templateUrl: './user-group-user-list.component.html',
  styleUrls: ['./user-group-user-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class UserGroupUserListComponent implements AfterViewInit, AfterViewChecked {
  @Input() userGroup: UserGroup;
  @ViewChildren('booleanCell') booleanCell: QueryList<TemplateRef<any>>;
  @ViewChildren('assignedCell') assignedCell: QueryList<TemplateRef<any>>;

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected users: UserGroupUser[] = [];

  protected loading: boolean = false;
  protected confirm: string;
  protected selected: UserGroupUser[];

  constructor(private userGroupService: UserGroupService,
              private userService: UserService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              protected _datePipe: DatePipe,
              private cdRef: ChangeDetectorRef,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngAfterViewInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('lastname'),
        this.transloco.selectTranslate('assigned'),
        this.transloco.selectTranslate('username'),
        this.transloco.selectTranslate('email'),
        this.transloco.selectTranslate('phone', {}, {scope:'components/lists'}),
        this.transloco.selectTranslate('accountLocked', {}, {scope:'components/lists'}),
        this.transloco.selectTranslate('accountBlocked', {}, {scope:'components/lists'}),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, lastname, assigned, username, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(id, 'id', false, 80),
        new DatatableColumn(name, 'name', true, 250),
        new DatatableColumn(lastname, 'lastname', true, 250),
        new DatatableColumn(assigned, 'assigned', true, 185, undefined, undefined, this.assignedCell.first),
        new DatatableColumn(username, 'username'),
        new DatatableColumn(email, 'email', false),
        new DatatableColumn(phone, 'phone', false),
        new DatatableColumn(accountLocked, 'accountLocked', false, 200, undefined, undefined, this.booleanCell.first),
        new DatatableColumn(accountBlocked, 'accountBlocked', false, 200, undefined, undefined, this.booleanCell.first),
        new DatatableColumn(createdBy, 'createdBy', false),
        new DatatableColumn(createdAt, 'createdAt', false, undefined, undefined, this.datePipe()),
        new DatatableColumn(updatedBy, 'updatedBy', false),
        new DatatableColumn(updatedAt, 'updatedAt', false, undefined, undefined, this.datePipe())
      ];
      this.loadData();
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
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
        this.loading = false;
      }, error: (): void => {
        this.loading = false;
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    });
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
