import {Component, Input} from '@angular/core';
import {User} from "authorization-services-lib";
import {TRANSLOCO_SCOPE} from "@ngneat/transloco";
import {Type} from "biit-ui/inputs";

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

  protected pwdVerification: string;
  protected readonly Type = Type;
}
