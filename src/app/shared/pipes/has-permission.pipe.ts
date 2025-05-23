import { Pipe, PipeTransform } from '@angular/core';
import {PermissionService} from "../../services/permission.service";
import {Permission} from "../../config/rbac/permission";

@Pipe({
  name: 'hasPermission',
  standalone: true
})
export class HasPermissionPipe implements PipeTransform {
  constructor(private permissionService: PermissionService) {
  }

  transform(value: Permission): unknown {
    return this.permissionService.hasPermission(value);
  }

}
