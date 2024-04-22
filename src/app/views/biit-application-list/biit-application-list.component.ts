import {Component} from '@angular/core';
import {BiitTableColumn, BiitTableColumnFormat, BiitTableData, BiitTableResponse, GenericSort} from "biit-ui/table";
import {Application, ApplicationService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {GenericFilter} from "../../shared/utils/generic-filter";
import {ApplicationFormType} from "../../shared/forms/application-form/application-form.component";

@Component({
  selector: 'app-biit-application-list',
  templateUrl: './biit-application-list.component.html',
  styleUrls: ['./biit-application-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/application_list', alias: 'applications'}
    }
  ]
})
export class BiitApplicationListComponent {

  private static readonly DEFAULT_PAGE_SIZE: number = 10;
  private static readonly DEFAULT_PAGE: number = 1;

  protected columns: BiitTableColumn[] = [];
  protected pageSize: number = BiitApplicationListComponent.DEFAULT_PAGE_SIZE;
  protected page: number = BiitApplicationListComponent.DEFAULT_PAGE_SIZE;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected applications: Application[];
  protected application: Application;
  protected data: BiitTableData<Application>;

  protected target: Application;
  protected popup: ApplicationFormType;
  protected confirm: null | 'DELETE';
  protected selected: Application[] = [];
  protected loading: boolean = false;

  constructor(private applicationService: ApplicationService,
              private biitSnackbarService: BiitSnackbarService,
              private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.transloco.selectTranslate('id', {}, {scope: 'components/application_list', alias: 'roles'}),
        this.transloco.selectTranslate('description', {}, {scope: 'components/application_list', alias: 'roles'}),
        this.transloco.selectTranslate('createdBy', {}, {scope: 'components/application_list', alias: 'roles'}),
        this.transloco.selectTranslate('createdAt', {}, {scope: 'components/application_list', alias: 'roles'}),
        this.transloco.selectTranslate('updatedBy', {}, {scope: 'components/application_list', alias: 'roles'}),
        this.transloco.selectTranslate('updatedAt',{}, {scope: 'components/application_list', alias: 'roles'}),
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
      this.pageSize = BiitApplicationListComponent.DEFAULT_PAGE_SIZE;
      this.page = BiitApplicationListComponent.DEFAULT_PAGE;
      this.loadData();
    });


  }

  private loadData(): void {
    this.loading = true;
    this.applicationService.getAll().subscribe( {
      next: (applications: Application[]): void => {
        this.applications = applications.map(application => Application.clone(application));
        this.applications.sort((a,b) => {
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
    if (this.applications.length > (this.page * this.pageSize - this.pageSize)) {
      this.data = new BiitTableData(this.applications.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.applications.length);
    }
  }

  protected onAdd(): void {
    this.target = new Application();
    this.popup = ApplicationFormType.CREATE;
  }

  protected onDelete(applications: Application[], confirmed: boolean): void {
    if (!confirmed) {
      this.confirm = 'DELETE';
      this.selected = applications;
    } else {
      this.confirm = null;
      combineLatest(applications.map(application => this.applicationService.deleteById(application.id)))
        .subscribe({next: (): void => {
            this.loadData();
            this.transloco.selectTranslate('request_completed_successfully', {}, {scope: '', alias: 'applications'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
              }
            );
          }, error: (): void => {
            this.transloco.selectTranslate('request_unsuccessful', {}, {scope: '', alias: 'applications'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null, 5);
              }
            );
          }});
    }
  }

  protected onSaved(application: Application): void {
    this.loadData();
    this.target = null;
    this.popup = null;
  }

  onEdit(applications: Application[]): void {
    if (applications && applications.length === 1) {
      this.target = Application.clone(applications[0]);
      this.popup = ApplicationFormType.EDIT;
    } else {
      this.transloco.selectTranslate('bad_implementation', {}, {scope: '', alias: ''}).subscribe(
        translation => {
          this.biitSnackbarService.showNotification(translation.replace('${CODE}', 'ULC0'), NotificationType.ERROR, undefined, 10);
        }
      );
    }
  }

  onAssign(applications: Application[]): void {
    if (applications && applications.length) {
      this.application = applications[0];
    }
  }

  protected onTableUpdate(tableResponse: BiitTableResponse): void {
    this.pageSize = tableResponse.pageSize;
    this.page = tableResponse.currentPage;
    if (tableResponse.search && tableResponse.search.length) {
      const applications: Application[] = this.applications.filter(application => GenericFilter.filter(application, tableResponse.search, true));
      this.data = new BiitTableData(applications.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), applications.length);
    } else {
      this.data = new BiitTableData(this.applications.slice(this.page * this.pageSize - this.pageSize, this.page * this.pageSize), this.applications.length);
    }
    GenericSort.sort(this.data.data, tableResponse.sorting, this.columns);
  }
}
