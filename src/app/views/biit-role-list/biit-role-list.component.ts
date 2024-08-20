import {Component} from '@angular/core';
import {
  BiitTableColumn,
  BiitTableColumnFormat,
  BiitTableData,
  BiitTableResponse,
  DatatableColumn,
  GenericSort
} from "biit-ui/table";
import {Role, RoleService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {GenericFilter} from "../../shared/utils/generic-filter";
import {RoleFormType} from "../../shared/forms/role-form/role-form.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-biit-role-list',
  templateUrl: './biit-role-list.component.html',
  styleUrls: ['./biit-role-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class BiitRoleListComponent {

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected roles: Role[];
  protected role: Role;

  protected target: Role;
  protected popup: RoleFormType;
  protected confirm: null | 'DELETE';
  protected selected: Role[] = [];
  protected loading: boolean = false;

  constructor(private roleService: RoleService,
              private _datePipe: DatePipe,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  datePipe() {
    return {transform: (value: any) => this._datePipe.transform(value, 'dd/MM/yyyy')}
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id'),
        this.transloco.selectTranslate('description'),
        this.transloco.selectTranslate('createdBy'),
        this.transloco.selectTranslate('createdAt'),
        this.transloco.selectTranslate('updatedBy'),
        this.transloco.selectTranslate('updatedAt'),
      ]
    ).subscribe(([id, description, createdBy, createdAt, updatedBy, updatedAt]) => {
      this.columns = [
        new DatatableColumn(id, 'id'),
        new DatatableColumn(description, 'description'),
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
        this.loading = false;
      }, error: (): void => {
        this.loading = false;
        this.biitSnackbarService.showNotification('request_unsuccessful', NotificationType.ERROR, null, 5);
      }
    });
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

  protected onSaved(role: Role): void {
    this.loadData();
    this.target = null;
    this.popup = null;
  }

  onEdit(roles: Role[]): void {
    this.target = Role.clone(roles[0]);
    this.popup = RoleFormType.EDIT;
  }

  onAssign(roles: Role[]): void {
    if (roles && roles.length) {
      this.role = roles[0];
    }
  }
}
