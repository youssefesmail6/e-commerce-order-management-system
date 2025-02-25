import { RoleNames } from "../models/user";

export class JwtDto {
  public userId!: string;
  public email!: string;
  public role!: RoleNames;
  public isAdmin!: boolean;
}
