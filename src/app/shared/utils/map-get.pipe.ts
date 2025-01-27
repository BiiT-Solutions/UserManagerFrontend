import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapGet',
  pure: false
})
export class MapGetPipe implements PipeTransform {

  transform<K, T>(map: Map<K, T>, keys: K | K[]): T {
    const key: K = keys instanceof Array ? keys.find(key => map.has(key)) : keys;
    if (!key) {
      return undefined;
    }
    return map.get(key);
  }

}
