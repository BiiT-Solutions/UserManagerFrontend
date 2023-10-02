import {isNumber} from "@ngneat/transloco";

export class GenericFilter {
  public static filter<T>(object: T, value: string, includes: boolean = false, caseSensitive: boolean = false, params?: string[]): boolean {
    const formattedValue: string = caseSensitive ? value : value?.toLowerCase();
    let match: boolean = false;
    debugger

    for (let param in object) {
      if (params && params.includes(param)) continue
      let paramValue: unknown = object[param];
      if (paramValue instanceof Array) {
        if ((paramValue as Array<any>).some((item: any) => {
          return GenericFilter.filter(item, value, includes, caseSensitive);
        })) {
          return true;
        }
        continue;
      }
      if (typeof paramValue === 'string' || typeof paramValue === 'number' || typeof paramValue === 'boolean') {
        let stringValue: string = paramValue.toString();
        if (!caseSensitive) {
          stringValue = stringValue.toLowerCase();
        }
        if (includes) {
          if (stringValue.includes(formattedValue)) {
            return true;
          }
        } else {
          if (stringValue === formattedValue) {
            return true;
          }
        }
        continue;
      }
      if(object[param] === value) {
        return true;
      }
    }
    return false;
  }
}
