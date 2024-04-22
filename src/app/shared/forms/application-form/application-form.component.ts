import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Application, ApplicationService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import { ApplicationFormValidationFields } from '../../validations/forms/application-form-validation-fields';

@Component({
  selector: 'biit-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/application_form', alias: 'form'}
    }
  ]
})
export class ApplicationFormComponent {
  @Input() application: Application;
  @Input() type: ApplicationFormType;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Application> = new EventEmitter<Application>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected errors: Map<ApplicationFormValidationFields, string> = new Map<ApplicationFormValidationFields, string>();
  protected readonly ApplicationFormValidationFields = ApplicationFormValidationFields;
  protected readonly ApplicationFormType = ApplicationFormType;


  constructor(private applicationService: ApplicationService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }
  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('form.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<Application> = this.type == ApplicationFormType.CREATE ? this.applicationService.create(this.application) : this.applicationService.update(this.application);
    observable.subscribe(
      {
        next: (application: Application): void => {
          this.onSaved.emit(Application.clone(application));
        },
        error: (error: any): void => {
          this.biitSnackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<ApplicationFormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.application.id) {
      verdict = false;
      this.errors.set(ApplicationFormValidationFields.NAME_MANDATORY, this.transloco.translate(`form.${ApplicationFormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}

export enum ApplicationFormType {
  CREATE = "create_application",
  EDIT = "edit_application",
  ASSIGN = "assign_application"
}
