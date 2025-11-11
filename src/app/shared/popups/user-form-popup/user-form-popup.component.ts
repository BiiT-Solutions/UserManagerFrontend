import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "@biit-solutions/authorization-services";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {SessionService} from "@biit-solutions/user-manager-structure";
import {FormValidationFields} from "../../validations/form-validation-fields";
import {InputLimits} from "@biit-solutions/wizardry-theme/utils";

@Component({
  selector: 'biit-user-form-popup-popup',
  templateUrl: './user-form-popup.component.html',
  styleUrls: ['./user-form-popup.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {scope: 'components/forms', alias: 't'}
    }
  ]
})
export class UserFormPopupComponent implements OnInit {
  @Input() user: User;
  @Output() onClosed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSaved: EventEmitter<User> = new EventEmitter<User>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  protected readonly FormValidationFields = FormValidationFields;
  protected errors: Map<FormValidationFields, string> = new Map<FormValidationFields, string>();
  protected loggedUser: User;

  protected saving: boolean = false;

  constructor(protected sessionService: SessionService,
              protected transloco: TranslocoService) {
  }

  ngOnInit(): void {
    this.loggedUser = this.sessionService.getUser();
  }
}
