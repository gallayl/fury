type FuryUser = import("@furystack/core/dist/Models/User").User;

export class User implements FuryUser {
  public username = "";
  public roles: string[] = [];
}
