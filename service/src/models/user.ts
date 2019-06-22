import { User as FUser, Role } from "@furystack/core";

export class User implements FUser {
  public username!: string;
  public password!: string;
  roles: Role[] = [];
}
