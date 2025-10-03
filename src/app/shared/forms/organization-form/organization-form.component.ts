import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Organization, OrganizationService, SessionService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {FormValidationFields} from "../../validations/form-validation-fields";
import {ErrorHandler, InputLimits} from "biit-ui/utils";

@Component({
  selector: 'biit-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/forms', alias: 't'}
    }
  ]
})
export class OrganizationFormComponent {
  @Input() organization: Organization;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Organization> = new EventEmitter<Organization>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();


  protected NAME_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected NAME_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected DESCRIPTION_MAX_LENGTH: number = InputLimits.MAX_BIG_FIELD_LENGTH;

  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected readonly FormValidationFields = FormValidationFields;
  protected saving: boolean = false;


  constructor(private organizationService: OrganizationService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
  ) {
  }

  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('validation_failed'), NotificationType.WARNING, null);
      return;
    }
    const observable: Observable<Organization> = this.organization.id ? this.organizationService.update(this.organization) : this.organizationService.create(this.organization);
    this.saving = true;
    observable.subscribe(
      {
        next: (organization: Organization): void => {
          this.onSaved.emit(Organization.clone(organization));
          let message: string;
          if (!this.organization.id) {
            message = 'request_success';
          } else {
            message = 'update_request_success';
          }
          this.transloco.selectTranslate(message, {}, {scope: 'biit-ui/utils'}).subscribe(
            translation => {
              this.biitSnackbarService.showNotification(translation, NotificationType.SUCCESS, null);
            }
          );
        },
        error: error => ErrorHandler.notify(error, this.transloco, this.biitSnackbarService)
      }
    ).add(() => this.saving = false);
  }

  protected validate(): boolean {
    this.errors = new Map<FormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.organization.name) {
      verdict = false;
      this.errors.set(FormValidationFields.NAME_MANDATORY, this.transloco.translate(`t.${FormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
