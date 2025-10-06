import {Component, OnInit} from '@angular/core';
import {User} from "authorization-services-lib";
import {SessionService} from "user-manager-structure-lib";
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-custom-profile',
  templateUrl: './custom-profile.component.html',
  styleUrls: ['./custom-profile.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/lists', alias: 't'}
    }
  ]
})
export class CustomProfileComponent implements OnInit {
  user: User;

  constructor(protected sessionService: SessionService,
              protected transloco: TranslocoService) {
  }

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
  }

}
