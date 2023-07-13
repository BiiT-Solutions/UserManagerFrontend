export class Constants {
   public static readonly SESSION_STORAGE = class {
     public static readonly AUTH_TOKEN: string = 'authToken';
     public static readonly AUTH_EXPIRATION: string = 'authExp';
     public static readonly USER: string = 'user';
   }

  public static readonly PATHS = class {
     public static readonly PORTAL: string = '/portal';
    public static readonly QUERY = class {
      public static readonly EXPIRED: string = 'expired';
      public static readonly LOGOUT: string = 'logout';
    }
  }
  public static readonly HEADERS = class {
    public static readonly AUTHORIZATION: string = 'Authorization';
    public static readonly AUTHORIZATION_RESPONSE: string = 'authorization';
    public static readonly EXPIRES: string = 'expires';
  }
}
