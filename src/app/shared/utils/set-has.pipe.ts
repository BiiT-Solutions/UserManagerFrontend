import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setHas'
})
export class SetHasPipe implements PipeTransform {

  transform<T>(set: Set<T>, key: T): boolean {
    return set.has(key);
  }

}
