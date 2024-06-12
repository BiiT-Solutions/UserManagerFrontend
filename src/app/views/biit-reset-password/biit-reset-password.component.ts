import {Component} from '@angular/core';
import {Type} from "biit-ui/inputs";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {ActivatedRoute} from "@angular/router";
import {FormValidationFields} from "../../shared/validations/form-validation-fields";
import {UserService} from "user-manager-structure-lib";

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

  protected password: string[] = ["", ""];
  protected complete = false;
  protected token;

  protected pwdErrors: Map<FormValidationFields, string>;

  constructor(public translocoService: TranslocoService,
              private route: ActivatedRoute,
              private userService: UserService) {
    this.token = this.route.snapshot.paramMap.get('token');

    if (this.token) {
      this.userService.checkToken(this.token).subscribe({
        error: () => {
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
        error: () => {
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
