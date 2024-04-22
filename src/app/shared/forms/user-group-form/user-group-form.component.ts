import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {SessionService, UserGroup, UserGroupService} from "user-manager-structure-lib";
import {BiitSnackbarService, NotificationType} from "biit-ui/info";
import {Observable} from "rxjs";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import { UserGroupFormValidationFields } from '../../validations/forms/user-group-form-validation-fields';

@Component({
  selector: 'biit-user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/user_group_form', alias: 'form'}
    }
  ]
})
export class UserGroupFormComponent {
  @Input() userGroup: UserGroup;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<UserGroup> = new EventEmitter<UserGroup>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected errors: Map<UserGroupFormValidationFields, string> = new Map<UserGroupFormValidationFields, string>();
  protected readonly UserGroupFormValidationFields = UserGroupFormValidationFields;


  constructor(private userGroupService: UserGroupService,
              protected sessionService: SessionService,
              protected transloco: TranslocoService,
              private biitSnackbarService: BiitSnackbarService
              ) { }

  protected onSave(): void {
    if (!this.validate()) {
      this.biitSnackbarService.showNotification(this.transloco.translate('validation_failed'), NotificationType.WARNING, null, 5);
      return;
    }
    const observable: Observable<UserGroup> = this.userGroup.id ? this.userGroupService.update(this.userGroup) : this.userGroupService.create(this.userGroup);
    observable.subscribe(
      {
        next: (userGroup: UserGroup): void => {
          this.onSaved.emit(UserGroup.clone(userGroup));
        },
        error: (error: HttpErrorResponse): void => {
          switch (error.status) {
            case HttpStatusCode.Conflict:
              this.biitSnackbarService.showNotification(this.transloco.translate('form.request_failed_group_already_exists'), NotificationType.WARNING, null, 5);
              this.errors.set(UserGroupFormValidationFields.NAME_EXISTS, this.transloco.translate(`form.${UserGroupFormValidationFields.NAME_EXISTS.toString()}`));
              break;
            default:
              this.biitSnackbarService.showNotification(this.transloco.translate('server_failed'), NotificationType.WARNING, null, 5);
          }
        }
      }
    );
  }
  protected validate(): boolean {
    this.errors = new Map<UserGroupFormValidationFields, string>();
    let verdict: boolean = true;
    if (!this.userGroup.name) {
      verdict = false;
      this.errors.set(UserGroupFormValidationFields.NAME_MANDATORY, this.transloco.translate(`form.${UserGroupFormValidationFields.NAME_MANDATORY.toString()}`));
    }
    return verdict;
  }
}
