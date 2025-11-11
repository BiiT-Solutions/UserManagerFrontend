import {Component} from '@angular/core';
import {DatatableColumn} from "@biit-solutions/wizardry-theme/table";
import {Application, ApplicationService} from "@biit-solutions/user-manager-structure";
import {BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {combineLatest} from "rxjs";
import {ApplicationFormType} from "../../shared/forms/application-form/application-form.component";
import {DatePipe} from "@angular/common";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";
import {Permission} from "../../config/rbac/permission";

@Component({
  selector: 'app-biit-application-list',
  templateUrl: './biit-application-list.component.html',
  styleUrls: ['./biit-application-list.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class BiitApplicationListComponent {

  protected columns: DatatableColumn[] = [];
  protected pageSize: number = 10;
  protected pageSizes: number[] = [10, 25, 50, 100];
  protected applications: Application[];
  protected application: Application;

  protected target: Application;
  protected popup: ApplicationFormType;
  protected confirm: null | 'DELETE';
  protected selected: Application[] = [];
  protected loading: boolean = false;

  constructor(private applicationService: ApplicationService,
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
      },
      error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
    }).add(() => this.loading = false);
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
            this.transloco.selectTranslate('request_success', {}, {scope: 'biit-ui/utils'}).subscribe(
              translation => {
                this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null);
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
    this.popup = null;
  }

  onEdit(applications: Application[]): void {
    this.target = Application.clone(applications[0]);
    this.popup = ApplicationFormType.EDIT;
  }

  onAssign(applications: Application[]): void {
    this.application = applications[0];
  }

    protected readonly Permission = Permission;
}
