import {Component, OnInit} from '@angular/core';
import {DatatableColumn} from "biit-ui/table";
import {SessionService, UserGroup, UserGroupService} from "user-manager-structure-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {DatePipe} from "@angular/common";
import {ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'app-biit-user-group-list',
  templateUrl: './biit-user-group-list.component.html',
  styleUrls: ['./biit-user-group-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class BiitUserGroupListComponent implements OnInit {

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected userGroups: UserGroup[];

  protected target: UserGroup;
  protected confirm: null | 'DELETE';
  protected selected: UserGroup[] = [];
  protected loading: boolean = false;

  protected assignAppRoles: UserGroup;
  protected assignUsers: UserGroup;

  constructor(private userGroupService: UserGroupService,
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
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(id, 'id', false, 80),
        new DatatableColumn(name, 'name'),
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
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    }).add(() => this.loading = false);
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
      combineLatest(userGroups.map(userGroup => this.userGroupService.delete(userGroup.id))).subscribe({
        next: (): void => {
          this.loadData();
          this.transloco.selectTranslate('request_success', {}, {scope: 'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
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

  onEdit(userGroups: UserGroup[]): void {
    this.target = userGroups[0];
  }

  protected onAssignAppRoles(selectedRows: UserGroup[]): void {
    this.assignAppRoles = selectedRows[0];
  }

  protected onAssignUsers(selectedRows: UserGroup[]): void {
    this.assignUsers = selectedRows[0];
  }
}
