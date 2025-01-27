import {User} from "authorization-services-lib";
import {biitIcon} from "biit-icons-collection";

export class UserGroupUser extends User {
  assigned: biitIcon;

  public static override clone(from: UserGroupUser): UserGroupUser {
    const to: UserGroupUser = new UserGroupUser();
    UserGroupUser.copy(from, to);
    return to;
  }

  public static override copy(from: UserGroupUser, to: UserGroupUser): void {
    super.copy(from, to);
    to.assigned = from.assigned;
  }
}
