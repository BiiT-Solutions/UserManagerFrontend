import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Role, RoleService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {FormValidationFields} from '../../validations/form-validation-fields';
import {InputLimits, ErrorHandler} from "biit-ui/utils";

@Component({
  selector: 'biit-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/forms', alias: 't'}
    }
  ]
})
export class RoleFormComponent {
  @Input() role: Role;
  @Input() type: RoleFormType;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Role> = new EventEmitter<Role>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected NAME_MIN_LENGTH: number = InputLimits.MIN_FIELD_LENGTH;
  protected NAME_MAX_LENGTH: number = InputLimits.MAX_NORMAL_FIELD_LENGTH;
  protected DESCRIPTION_MAX_LENGTH: number = InputLimits.MAX_BIG_FIELD_LENGTH;


  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected readonly FormValidationFields = FormValidationFields;
  protected readonly RoleFormType = RoleFormType;


  constructor(private roleService: RoleService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
  ) {
  }

  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('t.validation_failed'), NotificationType.WARNING, null);
      return;
    }
    const observable: Observable<Role> = this.type == RoleFormType.CREATE ? this.roleService.create(this.role) : this.roleService.update(this.role);
    observable.subscribe(
      {
        next: (role: Role): void => {
          this.onSaved.emit(Role.clone(role));
          let message: string;
          if (this.type == RoleFormType.CREATE) {
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
    );
  }

  protected validate(): boolean {
    this.errors = new Map<FormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.role.id) {
      verdict = false;
      this.errors.set(FormValidationFields.NAME_MANDATORY, this.transloco.translate(`t.${FormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}

export enum RoleFormType {
  CREATE = "create_role",
  EDIT = "edit_role",
  ASSIGN = "assign_role"
}
