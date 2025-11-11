import { Pipe, PipeTransform } from '@angular/core';
import {User, AppRole} from "@biit-solutions/authorization-services";

@Pipe({
  name: 'hasRole'
})
export class HasRolePipe implements PipeTransform {

  transform(user: User, ...roles: AppRole[]): boolean {
    return roles && user.applicationRoles && roles.some(role => user.applicationRoles.includes(role));
  }

}
