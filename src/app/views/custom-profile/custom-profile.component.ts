import {Component, OnInit} from '@angular/core';
import {User} from "@biit-solutions/authorization-services";
import {SessionService} from "@biit-solutions/user-manager-structure";
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
