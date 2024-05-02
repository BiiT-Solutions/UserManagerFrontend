import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Organization, OrganizationService, SessionService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {FormValidationFields} from "../../validations/form-validation-fields";

@Component({
  selector: 'biit-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/organization', alias: 'form'}
    }
  ]
})
export class OrganizationFormComponent {
  @Input() organization: Organization;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Organization> = new EventEmitter<Organization>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected readonly FormValidationFields = FormValidationFields;


  constructor(private organizationService: OrganizationService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<Organization> = this.organization.id ? this.organizationService.update(this.organization) : this.organizationService.create(this.organization);
    observable.subscribe(
      {
        next: (organization: Organization): void => {
          this.onSaved.emit(Organization.clone(organization));
        },
        error: (error: HttpErrorResponse): void => {
          switch (error.status) {
            case HttpStatusCode.Conflict:
              this.biitSnackbarService.showNotification(this.transloco.translate('org.request_failed_team_already_exists'), NotificationType.WARNING, null, 5);
              this.errors.set(FormValidationFields.NAME_EXISTS, this.transloco.translate(`form.${FormValidationFields.NAME_EXISTS.toString()}`))
              break;
            default:
              this.biitSnackbarService.showNotification(this.transloco.translate('server_failed'), NotificationType.WARNING, null, 5);
          }
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<FormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.organization.name) {
      verdict = false;
      this.errors.set(FormValidationFields.NAME_MANDATORY, this.transloco.translate(`form.${FormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
