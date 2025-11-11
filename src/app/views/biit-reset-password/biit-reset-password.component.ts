import {Component} from '@angular/core';
import {Type} from "@biit-solutions/wizardry-theme/inputs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {ActivatedRoute} from "@angular/router";
import {FormValidationFields} from "../../shared/validations/form-validation-fields";
import {UserService} from "@biit-solutions/user-manager-structure";
import {ErrorHandler, InputLimits} from "@biit-solutions/wizardry-theme/utils";
import {BiitSnackbarService} from "@biit-solutions/wizardry-theme/info";

@Component({
  selector: 'biit-reset-password',
  templateUrl: './biit-reset-password.component.html',
  styleUrls: ['./biit-reset-password.component.scss'],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: {scope: 'components/reset_password', alias: "t"}
  }]
})
export class BiitResetPasswordComponent {

  protected readonly keyId: string;
  protected readonly Type = Type;
  protected readonly FormValidationFields = FormValidationFields;

  protected PASSWORD_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;

  protected password: string[] = ["", ""];
  protected complete = false;
  protected token;

  protected pwdErrors: Map<FormValidationFields, string>;

  constructor(public translocoService: TranslocoService,
              private snackbarService: BiitSnackbarService,
              private route: ActivatedRoute,
              private userService: UserService) {
    this.token = this.route.snapshot.paramMap.get('token');

    if (this.token) {
      this.userService.checkToken(this.token).subscribe({
        error: (error) => {
          ErrorHandler.notify(error, this.translocoService, this.snackbarService);
          this.token = undefined;
        }
      });
    }

    this.pwdErrors = new Map<FormValidationFields, string>();
    const generatedId: number = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    this.keyId = `${generatedId < 10 ? '0' : ''}${generatedId}`
  }

  protected performResetPassword(): void {
    if (this.validatePassword()) {
      this.userService.updatePasswordPublic(this.password[0], this.token).subscribe({
        next: () => {
          this.complete = true;
        },
        error: (error) => {
          ErrorHandler.notify(error, this.translocoService, this.snackbarService);
          this.token = undefined;
        }
      })
    }
  }

  private validatePassword(): boolean {
    this.pwdErrors.clear();
    if (!this.password[0] || !this.password[0].length) {
      this.pwdErrors.set(FormValidationFields.PASSWORD_MANDATORY, this.translocoService.translate('t.password_empty'));
    }
    if (this.password[0] !== this.password[1]) {
      this.pwdErrors.set(FormValidationFields.PASSWORD_MISMATCH, this.translocoService.translate('t.password_mismatch'));
    }
    return !this.pwdErrors.size;
  }
}
