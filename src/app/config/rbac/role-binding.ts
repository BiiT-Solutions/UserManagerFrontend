import {Role} from "authorization-services-lib";
import {Permission} from "./permission";
import {AppRole} from "authorization-services-lib/lib/models/app-role";

export class RoleBinding {

  private readonly USERMANAGERSYSTEM_ADMIN: Permission[] = [
    Permission.USERS.VIEW,
    Permission.USERS.CREATE,
    Permission.USERS.EDIT,
    Permission.USERS.DELETE,
    Permission.USERS.PERMISSIONS,

    Permission.ROLE_GROUPS.VIEW,
    Permission.ROLE_GROUPS.CREATE,
    Permission.ROLE_GROUPS.EDIT,
    Permission.ROLE_GROUPS.DELETE,
    Permission.ROLE_GROUPS.ASSIGN,
    Permission.ROLE_GROUPS.PERMISSIONS,

    Permission.ROLES.VIEW,
    Permission.ROLES.CREATE,
    Permission.ROLES.EDIT,
    Permission.ROLES.DELETE,
    Permission.ROLES.PERMISSIONS,

    Permission.APPLICATIONS.VIEW,
    Permission.APPLICATIONS.CREATE,
    Permission.APPLICATIONS.EDIT,
    Permission.APPLICATIONS.DELETE,
    Permission.APPLICATIONS.PERMISSIONS,

    Permission.SERVICES.VIEW,
    Permission.SERVICES.CREATE,
    Permission.SERVICES.EDIT,
    Permission.SERVICES.DELETE,
    Permission.SERVICES.PERMISSIONS,

    Permission.ORGANIZATIONS.VIEW,
    Permission.ORGANIZATIONS.CREATE,
    Permission.ORGANIZATIONS.EDIT,
    Permission.ORGANIZATIONS.DELETE,
    Permission.ORGANIZATIONS.ASSIGN,
  ];

  private readonly USERMANAGERSYSTEM_EDITOR: Permission[] = [
    Permission.USERS.VIEW,
    Permission.USERS.CREATE,
    Permission.USERS.EDIT,
    Permission.USERS.DELETE,

    Permission.ORGANIZATIONS.VIEW,
    Permission.ORGANIZATIONS.CREATE,
    Permission.ORGANIZATIONS.EDIT,
    Permission.ORGANIZATIONS.DELETE,
    Permission.ORGANIZATIONS.ASSIGN,
  ];

  private readonly USERMANAGERSYSTEM_ORGANIZATION_ADMIN: Permission[] = [
    Permission.USERS.VIEW,
    Permission.USERS.CREATE,
    Permission.USERS.EDIT,
    Permission.USERS.DELETE,
    Permission.USERS.PERMISSIONS,

    Permission.ORGANIZATIONS.VIEW,
    Permission.ORGANIZATIONS.ASSIGN,
  ];

  private readonly USERMANAGERSYSTEM_VIEWER: Permission[] = [
    Permission.USERS.VIEW,
  ];

  private roles: AppRole[];

  constructor(roles: AppRole[]) {
    this.roles = roles;
  }

  public getPermissions(): Set<Permission> {
    const roles: Permission[] = this.roles.map(role => {
      switch (role.toUpperCase()) {
        case Role.USERMANAGERSYSTEM_ADMIN:
          return this.USERMANAGERSYSTEM_ADMIN;
        case Role.USERMANAGERSYSTEM_EDITOR:
          return this.USERMANAGERSYSTEM_EDITOR;
        case Role.USERMANAGERSYSTEM_VIEWER:
          return this.USERMANAGERSYSTEM_VIEWER;
        case Role.USERMANAGERSYSTEM_ORGANIZATION_ADMIN:
          return this.USERMANAGERSYSTEM_ORGANIZATION_ADMIN;
        default:
          return [];
      }
    }).flat();
    return new Set<Permission>(roles);
  }

}
