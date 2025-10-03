import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppRole, PasswordRequest, User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Type} from "biit-ui/inputs";
import {SessionService, UserService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {FormValidationFields} from "../../validations/form-validation-fields";
import {TypeValidations} from "../../utils/type-validations";
import {PwdGenerator} from "../../utils/pwd-generator";
import {ErrorHandler, InputLimits} from "biit-ui/utils";

@Component({
  selector: 'biit-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/forms', alias: 't'}
    }
  ]
})
export class UserFormComponent implements OnInit {
  @Input() user: User;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<User> = new EventEmitter<User>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected USERNAME_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected USERNAME_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected EMAIL_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected EMAIL_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected NAME_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected NAME_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected LASTNAME_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected LASTNAME_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected PASSWORD_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected ADDRESS_MAX_LENGTH: number = InputLimits.MAX_BIG_FIELD_LENGTH;
  protected POSTALCODE_MAX_LENGTH: number = InputLimits.MAX_TINY_FIELD_LENGTH;
  protected PHONE_MAX_LENGTH: number = InputLimits.MAX_SMALL_FIELD_LENGTH;
  protected CITY_MAX_LENGTH: number = InputLimits.MAX_SMALL_FIELD_LENGTH;
  protected COUNTRY_MAX_LENGTH: number = InputLimits.MAX_SMALL_FIELD_LENGTH;

  protected expiratingAccount: boolean = false;
  protected pwdVerification: string;
  protected oldPassword: string;

  protected readonly FormValidationFields = FormValidationFields;
  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected loggedUser: User;

  protected readonly Type = Type;
  protected readonly AppRole = AppRole;

  protected today = new Date();
  protected saving: boolean = false;

  constructor(private userService: UserService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
  ) {
  }

  ngOnInit(): void {
    if (!this.user?.id) {
      this.generatePassword();
    }
    this.loggedUser = this.sessionService.getUser();
    if (this.user.accountExpirationTime) this.expiratingAccount = true;
  }

  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('t.validation_failed'), NotificationType.WARNING, null);
      return;
    }
    if (this.user.id && this.user.password && this.user.password === this.pwdVerification) {
      const passwordRequest: PasswordRequest = new PasswordRequest(this.oldPassword, this.user.password);
      const observable: Observable<User> = this.loggedUser.applicationRoles.includes(AppRole.USERMANAGERSYSTEM_ADMIN) ?
        this.userService.updatePassword(this.user.username, passwordRequest) : this.userService.updateCurrentPassword(passwordRequest);
      observable.subscribe({
        next: (): void => {
          this.biitSnackbarService.showNotification(this.transloco.translate('t.password_change_success'), NotificationType.SUCCESS, null);
        }, error: (): void => {
          this.biitSnackbarService.showNotification(this.transloco.translate('t.password_change_failed'), NotificationType.WARNING, null);
        }
      })
    }
    this.saving = true;
    const observable: Observable<User> = this.user.id ? this.userService.update(this.user) : this.userService.create(this.user);
    observable.subscribe(
      {
        next: (user: User): void => {
          this.onSaved.emit(User.clone(user));
          this.biitSnackbarService.showNotification(this.transloco.translate('t.user_created_success'), NotificationType.SUCCESS, null);
        },
        error: error => {
          ErrorHandler.notify(error, this.transloco, this.biitSnackbarService);
        }
      }
    ).add(() => this.saving = false);
  }

  protected validate(): boolean {
    this.errors = new Map<FormValidationFields, string>();
    let verdict: boolean = true;
    // if (!this.user.username) {
    //   verdict = false;
    //   this.errors.set(FormValidationFields.USERNAME_MANDATORY, this.transloco.translate(`t.${FormValidationFields.USERNAME_MANDATORY.toString()}`));
    // }
    if (this.user.username && this.user.username.indexOf(" ") >= 0) {
      verdict = false;
      this.errors.set(FormValidationFields.USERNAME_INVALID, this.transloco.translate(`t.${FormValidationFields.USERNAME_INVALID.toString()}`));
    }
    if (!this.user.name) {
      verdict = false;
      this.errors.set(FormValidationFields.NAME_MANDATORY, this.transloco.translate(`t.${FormValidationFields.NAME_MANDATORY.toString()}`));
    }
    if (!this.user.lastname) {
      verdict = false;
      this.errors.set(FormValidationFields.LASTNAME_MANDATORY, this.transloco.translate(`t.${FormValidationFields.LASTNAME_MANDATORY.toString()}`));
    }
    if (!this.user.id) {
      if (!this.user.password) {
        verdict = false;
        this.errors.set(FormValidationFields.PASSWORD_MANDATORY, this.transloco.translate(`t.${FormValidationFields.PASSWORD_MANDATORY.toString()}`));
      }
      if (this.pwdVerification !== this.user.password) {
        verdict = false;
        this.errors.set(FormValidationFields.PASSWORD_MISMATCH, this.transloco.translate(`t.${FormValidationFields.PASSWORD_MISMATCH.toString()}`));
      }
    } else {
      if (!this.loggedUser.applicationRoles.includes(AppRole.USERMANAGERSYSTEM_ADMIN)) {
        if (!this.oldPassword && (this.pwdVerification || this.user.password)) {
          verdict = false;
          this.errors.set(FormValidationFields.OLD_PASSWORD_MANDATORY, this.transloco.translate(`t.${FormValidationFields.OLD_PASSWORD_MANDATORY.toString()}`));
        }
      }
      if (this.pwdVerification !== this.user.password) {
        verdict = false;
        this.errors.set(FormValidationFields.PASSWORD_MISMATCH, this.transloco.translate(`t.${FormValidationFields.PASSWORD_MISMATCH.toString()}`));
      }
    }
    if (!this.user.email) {
      verdict = false;
      this.errors.set(FormValidationFields.EMAIL_MANDATORY, this.transloco.translate(`t.${FormValidationFields.EMAIL_MANDATORY.toString()}`));
    } else {
      if (!TypeValidations.isEmail(this.user.email)) {
        verdict = false;
        this.errors.set(FormValidationFields.EMAIL_MANDATORY, this.transloco.translate(`t.${FormValidationFields.EMAIL_INVALID.toString()}`));
      }
    }
    if (this.user.phone && !TypeValidations.isPhoneNumber(this.user.phone)) {
      verdict = false;
      this.errors.set(FormValidationFields.PHONE_INVALID, this.transloco.translate(`t.${FormValidationFields.PHONE_INVALID.toString()}`));
    }
    if (this.expiratingAccount && !this.user.accountExpirationTime) {
      verdict = false;
      this.errors.set(FormValidationFields.DATE_INVALID, this.transloco.translate(`t.${FormValidationFields.DATE_INVALID.toString()}`));
    }
    return verdict;
  }

  protected generatePassword(): void {
    this.user.password = PwdGenerator.generate();
    this.pwdVerification = this.user.password;
  }
}
