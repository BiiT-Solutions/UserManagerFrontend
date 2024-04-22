import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Type} from "biit-ui/inputs";
import {Organization, OrganizationService, SessionService, UserService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {OrganizationFormValidationFields} from "../../validations/forms/organization-form-validation-fields";

@Component({
  selector: 'biit-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/user_form', alias: 'form'}
    }
  ]
})
export class OrganizationFormComponent {
  @Input() organization: Organization;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Organization> = new EventEmitter<Organization>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected pwdVerification: string;
  protected oldPassword: string;
  protected readonly Type = Type;

  protected errors: Map<OrganizationFormValidationFields, string> = new Map<OrganizationFormValidationFields, string>();
  protected readonly OrganizationFormValidationFields = OrganizationFormValidationFields;


  constructor(private organizationService: OrganizationService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('form.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<Organization> = this.organization.id ? this.organizationService.update(this.organization) : this.organizationService.create(this.organization);
    observable.subscribe(
      {
        next: (organization: Organization): void => {
          this.onSaved.emit(Organization.clone(organization));
        },
        error: (error: HttpErrorResponse): void => {
          this.biitSnackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<OrganizationFormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.organization.name) {
      verdict = false;
      this.errors.set(OrganizationFormValidationFields.NAME_MANDATORY, this.transloco.translate(`form.${OrganizationFormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
