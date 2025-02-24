import Container from "typedi";
import { Logger } from "./logger.service";
import User from "../models/user";
import { AdminCreationAttributes } from "../models/user";

class UserService {
  private logger: Logger = Container.get(Logger);

  private constructor() {}
  public static async init(): Promise<UserService> {
    return new UserService();
  }

  async createAdminUser(
    adminData: AdminCreationAttributes,
  ): Promise<User> {
    try {
      const newAdmin = new User({ ...adminData, isAdmin: true });
      const admin = await newAdmin.save();
      return admin;
    } catch (error: any) {
      this.logger.error(`UserService.createAdminUser: ${error.message}`);
      throw error;
    }
  }

  async countUsers(whereOpts?: Partial<User>): Promise<number> {
    try {
      const opts = whereOpts ? { where: { ...whereOpts } } : {};
      return await User.count(opts);
    } catch (error: any) {
      this.logger.error(`UserService.countUsers: ${error.message}`);
      throw error;
    }
  }
}

export default UserService;
