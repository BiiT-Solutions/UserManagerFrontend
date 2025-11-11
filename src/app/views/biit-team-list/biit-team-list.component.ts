import {Component, OnInit} from '@angular/core';
import {TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Organization, OrganizationService} from "@biit-solutions/user-manager-structure";
import {BiitSnackbarService, NotificationType} from "@biit-solutions/wizardry-theme/info";
import {ErrorHandler} from "@biit-solutions/wizardry-theme/utils";
import {Router} from "@angular/router";
import {Constants} from "../../shared/constants";

@Component({
    selector: 'app-biit-team-list',
    templateUrl: './biit-team-list.component.html',
    styleUrls: ['./biit-team-list.component.scss'],
    providers: [
        {
            provide: TRANSLOCO_SCOPE,
            multi: true,
            useValue: {scope: 'components/lists', alias: 't'}
        }
    ]
})
export class BiitTeamListComponent implements OnInit {

    protected organization: Organization;

    constructor(private organizationService: OrganizationService,
                private biitSnackbarService: BiitSnackbarService,
                private translocoService: TranslocoService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.loadData();
    }


    private loadData(): void {
        this.organizationService.getAllByLoggedUser().subscribe({
            next: (organizations: Organization[]): void => {
                if (organizations.length !== 1) {
                    this.translocoService.selectTranslate('invalid_number_of_organizations', {}, {scope: 'biit-ui/utils'}).subscribe(msg => {
                        this.biitSnackbarService.showNotification(msg, NotificationType.ERROR, null);
                        this.router.navigate([Constants.PATHS.USERS]);
                    });
                } else {
                    this.organization = organizations[0];
                }
            },
            error: error => ErrorHandler.notify(error, this.translocoService, this.biitSnackbarService)
        });
    }


}

