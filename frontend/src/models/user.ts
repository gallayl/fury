type FuryUser = import("@furystack/core/dist/Models/User").User;

export class User implements FuryUser {
  public username: string = "";
  public roles: string[] = [];
}
