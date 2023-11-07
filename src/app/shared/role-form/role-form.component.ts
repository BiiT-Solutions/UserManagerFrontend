import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Role, RoleService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {RoleFormValidationFields} from "../validations/role-form/role-form-validation-fields";

@Component({
  selector: 'biit-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/role_form', alias: 'form'}
    }
  ]
})
export class RoleFormComponent {
  @Input() role: Role;
  @Input() type: RoleFormType;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<Role> = new EventEmitter<Role>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected errors: Map<RoleFormValidationFields, string> = new Map<RoleFormValidationFields, string>();
  protected readonly RoleFormValidationFields = RoleFormValidationFields;
  protected readonly RoleFormType = RoleFormType;


  constructor(private roleService: RoleService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }
  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('form.validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<Role> = this.type == RoleFormType.CREATE ? this.roleService.create(this.role) : this.roleService.update(this.role);
    observable.subscribe(
      {
        next: (role: Role): void => {
          this.onSaved.emit(Role.clone(role));
        },
        error: (error: any): void => {
          this.biitSnackbarService.showNotification(this.transloco.translate('form.server_failed'), NotificationType.WARNING, null, 5);
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<RoleFormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.role.id) {
      verdict = false;
      this.errors.set(RoleFormValidationFields.NAME_MANDATORY, this.transloco.translate(`form.${RoleFormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}

export enum RoleFormType {
  CREATE = "create_role",
  EDIT = "edit_role",
  ASSIGN = "assign_role"
}
