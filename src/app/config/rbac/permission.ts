export class Permission {
  public static readonly USERS = class {
    public static readonly VIEW: string = 'USERS_VIEW';
    public static readonly CREATE: string = 'USERS_CREATE';
    public static readonly EDIT: string = 'USERS_EDIT';
    public static readonly DELETE: string = 'USERS_DELETE';
    public static readonly PERMISSIONS: string = 'USERS_PERMISSIONS';
  }

  public static readonly ROLE_GROUPS = class {
    public static readonly VIEW: string = 'ROLE_GROUPS_VIEW';
    public static readonly CREATE: string = 'ROLE_GROUPS_CREATE';
    public static readonly EDIT: string = 'ROLE_GROUPS_EDIT';
    public static readonly DELETE: string = 'ROLE_GROUPS_DELETE';
    public static readonly ASSIGN: string = 'ROLE_GROUPS_ASSIGN';
    public static readonly PERMISSIONS: string = 'ROLE_GROUPS_PERMISSIONS';
  }

  public static readonly ROLES = class {
    public static readonly VIEW: string = 'ROLES_VIEW';
    public static readonly CREATE: string = 'ROLES_CREATE';
    public static readonly EDIT: string = 'ROLES_EDIT';
    public static readonly DELETE: string = 'ROLES_DELETE';
    public static readonly PERMISSIONS: string = 'ROLES_PERMISSIONS';
  }

  public static readonly APPLICATIONS = class {
    public static readonly VIEW: string = 'APPLICATIONS_VIEW';
    public static readonly CREATE: string = 'APPLICATIONS_CREATE';
    public static readonly EDIT: string = 'APPLICATIONS_EDIT';
    public static readonly DELETE: string = 'APPLICATIONS_DELETE';
    public static readonly PERMISSIONS: string = 'APPLICATIONS_PERMISSIONS';
  }

  public static readonly SERVICES = class {
    public static readonly VIEW: string = 'SERVICES_VIEW';
    public static readonly CREATE: string = 'SERVICES_CREATE';
    public static readonly EDIT: string = 'SERVICES_EDIT';
    public static readonly DELETE: string = 'SERVICES_DELETE';
    public static readonly PERMISSIONS: string = 'SERVICES_PERMISSIONS';
  }

  public static readonly ORGANIZATIONS = class {
    public static readonly VIEW: string = 'ORGANIZATIONS_VIEW';
    public static readonly CREATE: string = 'ORGANIZATIONS_CREATE';
    public static readonly EDIT: string = 'ORGANIZATIONS_EDIT';
    public static readonly DELETE: string = 'ORGANIZATIONS_DELETE';
    public static readonly ASSIGN: string = 'ORGANIZATIONS_ASSIGN';
  }

  public static readonly ORGANIZATIONS_TEAMS = class {
    public static readonly VIEW: string = 'ORGANIZATIONS_TEAMS_VIEW';
  }
}
