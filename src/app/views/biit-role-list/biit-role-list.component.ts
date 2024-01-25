import {Component} from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse, GenericSort} from "biit-ui/table";
import {Application, Role, RoleService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {GenericFilter} from "../../shared/utils/generic-filter";
import {RoleFormType} from "../../shared/role-form/role-form.component";

@Component({
  selector: 'app-biit-role-list',
  templateUrl: './biit-role-list.component.html',
  styleUrls: ['./biit-role-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/role_list', alias: 'roles'}
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
  protected role: Role;
  protected data: BiitTableData<Role>;

  protected target: Role;
  protected popup: RoleFormType;
  protected confirm: null | 'DELETE';
  protected selected: Role[] = [];
  protected loading: boolean = false;

  constructor(private roleService: RoleService,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id', {}, {scope: 'components/role_list', alias: 'roles'}),
        this.transloco.selectTranslate('description', {}, {scope: 'components/role_list', alias: 'roles'}),
        this.transloco.selectTranslate('createdBy', {}, {scope: 'components/role_list', alias: 'roles'}),
        this.transloco.selectTranslate('createdAt', {}, {scope: 'components/role_list', alias: 'roles'}),
        this.transloco.selectTranslate('updatedBy', {}, {scope: 'components/role_list', alias: 'roles'}),
        this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/role_list', alias: 'roles'}),
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
        this.roles.sort((a,b) => {
          if ( a.id < b.id ){
            return -1;
          } else if ( a.id > b.id ){
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
    if (this.roles.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.roles.length);
    }
  }

  protected onAdd(): void {
    this.target = new Role();
    this.popup = RoleFormType.CREATE;
  }

  protected onDelete(roles: Role[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'DELETE';
      this.selected = roles;
    } else {
      this.confirm = null;
      combineLatest(roles.map(role => this.roleService.deleteById(role.id)))
          .subscribe({next: (): void => {
              this.loadData();
              this.transloco.selectTranslate('request_completed_successfully', {}, {scope: '', alias: 'roles'}).subscribe(
                  translation => {
                    this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
                  }
              );
            }, error: (): void => {
              this.transloco.selectTranslate('request_unsuccessful', {}, {scope: '', alias: 'roles'}).subscribe(
                  translation => {
                    this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
                  }
              );
            }});
    }
  }

  protected onSaved(role: Role): void {
    this.loadData();
    this.target = null;
    this.popup = null;
  }

  onEdit(roles: Role[]): void {
    if (roles && roles.length === 1) {
      this.target = Role.clone(roles[0]);
      this.popup = RoleFormType.EDIT;
    } else {
      this.transloco.selectTranslate('bad_implementation', {}, {scope: '', alias: ''}).subscribe(
          translation => {
            this.biitSnackbarService.showNotification(translation.replace('${CODE}', 'ULC0'), NotificationType.ERROR, undefined, 10);
          }
      );
    }
  }

  onAssign(roles: Role[]): void {
    if (roles && roles.length) {
      this.role = roles[0];
    }
  }

  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const roles: Role[] = this.roles.filter(role => GenericFilter.filter(role, tableResponse.search, true));
      this.data = new BiitTableData(roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), roles.length);
    } else {
      this.data = new BiitTableData(this.roles.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.roles.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }
}
