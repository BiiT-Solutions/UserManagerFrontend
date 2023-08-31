import { Component } from '@angular/core';
import {completeIconSet} from "biit-icons-collection";
import {BiitIconService} from "biit-ui/icon";

@Component({
  selector: 'biit-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss']
})
export class PortalComponent {
  constructor(biitIconService: BiitIconService) {
    biitIconService.registerIcons(completeIconSet);
  }
}
