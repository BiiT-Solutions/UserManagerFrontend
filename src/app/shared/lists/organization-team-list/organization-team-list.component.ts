import {Component, Input, OnInit} from '@angular/core';
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
  BiitTableResponse,
  GenericFilter,
  GenericSort
} from "biit-ui/table";
import {User} from "authorization-services-lib";
import {FormValidationFields} from "../../validations/form-validation-fields";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {UserGroupUser} from "../../../models/user-group-user";

@Component({
  selector: 'organization-team-list',
  templateUrl: './organization-team-list.component.html',
  styleUrls: ['./organization-team-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/organization', alias: 'org'}
    }
  ]
})
export class OrganizationTeamListComponent implements OnInit {
  @Input() organization: Organization;

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = OrganizationTeamListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = OrganizationTeamListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected data: BiitTableData<Team>;
  protected teams: Team[];
  protected users: UserGroupUser[];
  protected targetTeam: Team;
  protected manageTeam: Team;

  protected userColumns: BiitTableColumn[] = [];
  protected userPageSize: number = OrganizationTeamListComponent.DEFAULT_PAGE_SIZE;
  protected userPage: number = OrganizationTeamListComponent.DEFAULT_PAGE_SIZE;
  protected userData: BiitTableData<UserGroupUser>;

  protected loading: boolean = false;
  protected confirm: string;
  protected selected: Team[];
  protected selectedUsers: UserGroupUser[];

  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected readonly FormValidationFields = FormValidationFields;

  constructor(private teamService: TeamService,
              private userService: UserService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  ngOnInit(): void {
    //Teams table
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('name'),
        this.transloco.selectTranslate('description'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
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
      this.pageSize = OrganizationTeamListComponent.DEFAULT_PAGE_SIZE;
      this.page = OrganizationTeamListComponent.DEFAULT_PAGE;
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
        this.transloco.selectTranslate('phone',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('accountLocked',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('accountBlocked',{}, {scope: 'components/user_list', alias: 'users'}),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, name, lastname, assigned, username, email, phone, accountLocked, accountBlocked, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.userColumns = [
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
      this.userPageSize = OrganizationTeamListComponent.DEFAULT_PAGE_SIZE;
      this.userPage = OrganizationTeamListComponent.DEFAULT_PAGE;
    });
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

        this.nextData();
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

        this.nextUserData();
      }, error: (): void => {
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    }).add(() => {
      this.loading = false;
    });


  }

  private nextData() {
    if (this.teams.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.teams.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.teams.length);
    } else if (this.teams.length > 0) {
      this.page = Math.trunc(this.teams.length / this.pageSize);
      this.data = new BiitTableData(this.teams.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.teams.length);
    } else {
      this.data = new BiitTableData([], 0);
    }
  }

  private nextUserData() {
    if (this.users.length > (this.userPage * this.userPageSize - this.userPageSize)) {
      this.userData = new BiitTableData(this.users.slice(this.userPage * this.userPageSize - this.userPageSize, this.userPage * this.userPageSize), this.users.length);
    }
  }

  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const teams: Team[] = this.teams.filter(team => GenericFilter.filter(team, tableResponse.search, true));
      this.data = new BiitTableData(teams.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), teams.length);
    } else {
      this.data = new BiitTableData(this.teams.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.teams.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }

  protected onUserTableUpdate(tableResponse: BiitTableResponse): void {
    this.userPageSize = tableResponse.pageSize;
    this.userPage = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const users: UserGroupUser[] = this.users.filter(user => GenericFilter.filter(user, tableResponse.search, true));
      this.userData = new BiitTableData(users.slice(this.userPage * this.userPageSize - this.userPageSize, this.userPage * this.userPageSize), users.length);
    } else {
      this.userData = new BiitTableData(this.users.slice(this.userPage * this.userPageSize - this.userPageSize, this.userPage * this.userPageSize), this.users.length);
    }
    GenericSort.sort(this.userData.data, tableResponse.sorting, this.userColumns);
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
          this.nextData();
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
              this.biitSnackbarService.showNotification(this.transloco.translate('server_failed'), NotificationType.WARNING, null, 5);
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
