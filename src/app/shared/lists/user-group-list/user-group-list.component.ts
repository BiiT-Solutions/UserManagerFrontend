import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  QueryList,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import {User} from "@biit-solutions/authorization-services";
import {DatatableColumn} from "@biit-solutions/wizardry-theme/table";
import {combineLatest} from "rxjs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {UserGroup, UserGroupService} from "@biit-solutions/user-manager-structure";
import {BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {DatePipe} from "@angular/common";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";

@Component({
  selector: 'user-group-list',
  templateUrl: './user-group-list.component.html',
  styleUrls: ['./user-group-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class UserGroupListComponent implements AfterViewInit, AfterViewChecked {

  @Input() user: User;
  @ViewChildren('assignedCell') assignedCell: QueryList<TemplateRef<any>>;

  protected readonly pageSizes: number[] = [10, 25, 50, 100];
  protected pageSize: number = 10;
  protected columns: DatatableColumn[] = [];
  protected loading: boolean = false;
  protected userGroups: {userGroup: UserGroup, assigned: boolean}[];
  protected assigningGroups: UserGroup[];
  protected unassigningGroups: UserGroup[];

  constructor(private userGroupService: UserGroupService,
              private _datePipe: DatePipe,
              private cdRef: ChangeDetectorRef,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngAfterViewInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('assigned'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, assigned, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(id, 'userGroup.id', false, 80),
        new DatatableColumn(name, 'userGroup.name'),
        new DatatableColumn(assigned, 'assigned', true, undefined, undefined, undefined, this.assignedCell.first),
        new DatatableColumn(createdBy, 'userGroup.createdBy', false),
        new DatatableColumn(createdAt, 'userGroup.createdAt', false, undefined, undefined, this.datePipe()),
        new DatatableColumn(updatedBy, 'userGroup.updatedBy', false),
        new DatatableColumn(updatedAt, 'userGroup.updatedAt', false, undefined, undefined, this.datePipe())
      ];
      this.loadData();
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  private loadData(): void {
    this.loading = true;
    combineLatest([
      this.userGroupService.getAll(),
      this.userGroupService.getByUsername(this.user.username)
    ]).subscribe( {
      next: ([userGroups, assigned]): void => {
        this.userGroups = userGroups.map(userGroup => {return {userGroup: UserGroup.clone(userGroup), assigned: assigned.some(g => g.id == userGroup.id)}});
        this.userGroups.sort((a,b) => {
          if ( a.userGroup.name < b.userGroup.name ){
            return -1;
          } else if ( a.userGroup.name > b.userGroup.name ){
            return 1;
          } else {
            return 0;
          }
        });
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    }).add(() => this.loading = false);
  }

  protected assignGroup(selection: {userGroup: UserGroup, assigned: boolean}[], confirmed: boolean): void {
    if (!confirmed) {
      this.assigningGroups = selection.map(g => g.userGroup);
      return;
    }
    combineLatest(this.assigningGroups.map(g => this.userGroupService.addUsers(g.id, [this.user]))).subscribe({
      next: (): void => {
        this.loadData();
        this.assigningGroups = null;
        this.biitSnackbarService.showNotification(this.transloco.translate('t.user_groups_assign_success'), NotificationType.SUCCESS, null);
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    });
  }

  protected unassignGroup(selection: {userGroup: UserGroup, assigned: boolean}[], confirmed: boolean): void {
    if (!confirmed) {
      this.unassigningGroups = selection.map(g => g.userGroup);
      return;
    }
    combineLatest(this.unassigningGroups.map(g => this.userGroupService.removeUsers(g.id, [this.user]))).subscribe({
      next: (): void => {
        this.loadData();
        this.unassigningGroups = null;
        this.biitSnackbarService.showNotification(this.transloco.translate('t.user_groups_unassign_success'), NotificationType.SUCCESS, null);
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    });
  }
}
