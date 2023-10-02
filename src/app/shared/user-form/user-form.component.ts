import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Type} from "biit-ui/inputs";
import {UserService} from "user-manager-structure-lib";
import {UserFormValidationFields} from "../validations/user-form/user-form-validation-fields";
import {TypeValidations} from "../utils/type-validations";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";

@Component({
  selector: 'biit-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/user_form', alias: 'form'}
    }
  ]
})
export class UserFormComponent {
  @Input() user: User;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<User> = new EventEmitter<User>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected pwdVerification: string;
  protected readonly Type = Type;

  protected errors: Map<UserFormValidationFields, string> = new Map<UserFormValidationFields, string>();
  protected readonly UserFormValidationFields = UserFormValidationFields;


  constructor(private userService: UserService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }
  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('form.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    this.userService.create(this.user).subscribe(
      {
        next: (user: User): void => {
          this.onSaved.emit(User.clone(user));
        },
        error: (error: any): void => {
          this.biitSnackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<UserFormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.user.username) {
      verdict = false;
      this.errors.set(UserFormValidationFields.USERNAME_MANDATORY, this.transloco.translate(`form.${UserFormValidationFields.USERNAME_MANDATORY.toString()}`));
    }
    if (!this.user.name) {
      verdict = false;
      this.errors.set(UserFormValidationFields.NAME_MANDATORY, this.transloco.translate(`form.${UserFormValidationFields.NAME_MANDATORY.toString()}`));
    }
    if (!this.user.lastname) {
      verdict = false;
      this.errors.set(UserFormValidationFields.LASTNAME_MANDATORY, this.transloco.translate(`form.${UserFormValidationFields.LASTNAME_MANDATORY.toString()}`));
    }
    if (!this.user.password) {
      verdict = false;
      this.errors.set(UserFormValidationFields.PASSWORD_MANDATORY, this.transloco.translate(`form.${UserFormValidationFields.PASSWORD_MANDATORY.toString()}`));
    }
    if (this.pwdVerification !== this.user.password) {
      verdict = false;
      this.errors.set(UserFormValidationFields.PASSWORD_MISMATCH, this.transloco.translate(`form.${UserFormValidationFields.PASSWORD_MISMATCH.toString()}`));
    }
    if (!this.user.email) {
      verdict = false;
      this.errors.set(UserFormValidationFields.EMAIL_MANDATORY, this.transloco.translate(`form.${UserFormValidationFields.EMAIL_MANDATORY.toString()}`));
    } else {
      if (!TypeValidations.isEmail(this.user.email)) {
        verdict = false;
        this.errors.set(UserFormValidationFields.EMAIL_MANDATORY, this.transloco.translate(`form.${UserFormValidationFields.EMAIL_INVALID.toString()}`));
      }
    }
    if (this.user.phone && !TypeValidations.isPhoneNumber(this.user.phone)) {
      verdict = false;
      this.errors.set(UserFormValidationFields.PHONE_INVALID, this.transloco.translate(`form.${UserFormValidationFields.PHONE_INVALID.toString()}`));
    }
    return verdict;
  }

}
