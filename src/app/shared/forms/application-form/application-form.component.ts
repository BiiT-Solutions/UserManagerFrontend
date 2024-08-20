import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Application, ApplicationService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import { FormValidationFields } from '../../validations/form-validation-fields';

@Component({
  selector: 'biit-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/forms', alias: 't'}
    }
  ]
})
export class ApplicationFormComponent {
  @Input() application: Application;
  @Input() type: ApplicationFormType;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected readonly FormValidationFields = FormValidationFields;
  protected readonly ApplicationFormType = ApplicationFormType;


  constructor(private applicationService: ApplicationService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }
  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('t.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<Application> = this.type == ApplicationFormType.CREATE ? this.applicationService.create(this.application) : this.applicationService.update(this.application);
    observable.subscribe(
      {
        next: (application: Application): void => {
          this.onSaved.emit(Application.clone(application));
        },
        error: (error: any): void => {
          this.transloco.selectTranslate('request_unsuccessful', {}, {scope:'biit-ui/utils'}).subscribe(msg => {
            this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null, 5);
          });
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<FormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.application.id) {
      verdict = false;
      this.errors.set(FormValidationFields.NAME_MANDATORY, this.transloco.translate(`t.${FormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}

export enum ApplicationFormType {
  CREATE = "create_application",
  EDIT = "edit_application",
  ASSIGN = "assign_application"
}
