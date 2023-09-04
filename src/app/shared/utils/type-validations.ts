export class TypeValidations {
  public static isEmail(value: string): boolean {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
  }
  public static isPhoneNumber(value: string): boolean {
    return /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?(-?\s?[0-9])+$/.test(value);
  }
}
