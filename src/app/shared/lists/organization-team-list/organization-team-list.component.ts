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
import {
  Organization,
  SessionService,
  Team,
  TeamService,
  UserService
} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {combineLatest, Observable} from "rxjs";
import {
  BiitTableColumn,
  BiitTableColumnFormat,
  BiitTableData,
  BiitTableResponse, DatatableColumn,
  GenericFilter,
  GenericSort
} from "biit-ui/table";
import {User} from "authorization-services-lib";
import {FormValidationFields} from "../../validations/form-validation-fields";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {UserGroupUser} from "../../../models/user-group-user";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'organization-team-list',
  templateUrl: './organization-team-list.component.html',
  styleUrls: ['./organization-team-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class OrganizationTeamListComponent implements AfterViewInit, AfterViewChecked {
  @Input() organization: Organization;
  @ViewChildren('booleanCell') booleanCell: QueryList<TemplateRef<any>>;
  @ViewChildren('assignedCell') assignedCell: QueryList<TemplateRef<any>>;

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected teams: Team[];
  protected users: UserGroupUser[];
  protected targetTeam: Team;
  protected manageTeam: Team;

  protected userColumns: DatatableColumn[] = [];

  protected loading: boolean = false;
  protected confirm: string;
  protected selected: Team[];
  protected selectedUsers: UserGroupUser[];

  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected readonly FormValidationFields = FormValidationFields;

  constructor(private teamService: TeamService,
              private userService: UserService,
              protected sessionService: SessionService,
              private cdRef: ChangeDetectorRef,
              private _datePipe: DatePipe,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngAfterViewInit(): void {
    //Teams table
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('description'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt')
      ]
    ).subscribe(([id, name, description, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new BiitTableColumn("id", id, 50, undefined, false),
        new BiitTableColumn("name", name, undefined, undefined, true),
        new BiitTableColumn("description", description, undefined, undefined, true),
        new BiitTableColumn("createdBy", createdBy, undefined, undefined, false),
        new BiitTableColumn("createdAt", createdAt, undefined, BiitTableColumnFormat.DATE, false),
        new BiitTableColumn("updatedBy", updatedBy, undefined, undefined, false),
        new BiitTableColumn("updatedAt", updatedAt, undefined, BiitTableColumnFormat.DATE, false),
      ];
      this.loadData();
    });

    //Users table
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('lastname'),
        this.transloco.selectTranslate('assigned'),
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
    ).subscribe(([id, name, lastname, assigned, username, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.userColumns = [
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
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  private loadData(): void {
    this.loading = true;

    this.teamService.getAllByOrganization(this.organization.id).subscribe({
      next: (teams: Team[]) => {
        this.teams = teams.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        });
      }, error: (): void => {
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    }).add(() => {
      this.loading = false;
    });
  }

  private loadUserData(): void {
    this.loading = true;
    combineLatest(
      [
        this.userService.getAll(),
        this.userService.getTeamUsers(this.manageTeam.id)
      ]
    ).subscribe({
      next: (result: [users: User[], teamMembers: User[]]) => {
        this.users = result[0].sort((a,b) => {
          if ( a.name < b.name ){
            return -1;
          } else if ( a.name > b.name ){
            return 1;
          } else {
            return 0;
          }
        })
          .map(user => UserGroupUser.clone(user as UserGroupUser));

        result[1]
          .forEach(user => this.users.find(u => u.username == user.username).assigned = 'user_single');
      }, error: (): void => {
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    }).add(() => {
      this.loading = false;
    });
  }

  protected onCommand(team: Team, command: string): void {
    this.confirm = command;
    if (team) {
      this.targetTeam = team;
    } else {
      this.targetTeam = new Team();
      this.targetTeam.organization = this.organization;
    }
  }

  protected onManageTeam(team: Team): void {
    this.manageTeam = team;
    this.loadUserData();
  }

  protected onSaveTeam(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<Team> = this.targetTeam.id ? this.teamService.update(this.targetTeam) : this.teamService.create(this.targetTeam);
    observable.subscribe(
      {
        next: (team: Team): void => {
          this.teams.push(Team.clone(team));
          this.teams.sort((a,b) => {
            if ( a.name < b.name ){
              return -1;
            } else if ( a.name > b.name ){
              return 1;
            } else {
              return 0;
            }
          });
          this.targetTeam = undefined;
          this.confirm = undefined;
        },
        error: (error: HttpErrorResponse): void => {
          switch (error.status) {
            case HttpStatusCode.Conflict:
              this.biitSnackbarService.showNotification(this.transloco.translate('org.request_failed_team_already_exists'), NotificationType.WARNING, null, 5);
              this.errors.set(FormValidationFields.NAME_EXISTS, this.transloco.translate(`org.${FormValidationFields.NAME_EXISTS.toString()}`))
              break;
            default:
              this.transloco.selectTranslate('request_unsuccessful', {}, {scope:'biit-ui/utils'}).subscribe(msg => {
                this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
              });
          }
        }
      }
    );
  }

  protected onRemoveTeam(teams: Team[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'REMOVE';
      this.selected = teams;
    } else {
      this.confirm = null;
      const calls: Observable<void>[] = [];
      this.selected.forEach(team => calls.push(this.teamService.deleteById(team.id)));

      combineLatest(calls).subscribe({
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

  protected onAssignUser(users: UserGroupUser[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'ASSIGN';
      this.selectedUsers = users;
    } else {
      this.confirm = null;
      this.teamService.assignUsers(this.manageTeam.id, users).subscribe({
        next: (): void => {
          this.loadUserData();
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
    }
  }

  protected onUnassignUser(users: UserGroupUser[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'UNASSIGN';
      this.selectedUsers = users;
    } else {
      this.confirm = null;
      this.teamService.unassignUsers(this.manageTeam.id, users).subscribe({
        next: (): void => {
          this.loadUserData();
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
    }
  }

  protected validate(): boolean {
    this.errors = new Map<FormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.targetTeam.name) {
      verdict = false;
      this.errors.set(FormValidationFields.NAME_MANDATORY, this.transloco.translate(`org.${FormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
