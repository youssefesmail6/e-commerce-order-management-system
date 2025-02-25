import Container from "typedi";
import { Logger } from "./logger.service";
import User, { RoleNames, UserCreationAttributes } from "../models/user";
import { AdminCreationAttributes } from "../models/user";
import bcrypt from "bcryptjs";
import BadRequestException from "../exceptions/bad-request.exception";


class UserService {
  private logger: Logger = Container.get(Logger);

  private constructor() {}
  public static async init(): Promise<UserService> {
    return new UserService();
  }

  async createAdminUser(adminData: AdminCreationAttributes): Promise<User> {
    try {
      const newAdmin = new User({ ...adminData, isAdmin: true });
      const admin = await newAdmin.save();
      return admin;
    } catch (error: any) {
      this.logger.error(`UserService.createAdminUser: ${error.message}`);
      throw error;
    }
  }

  async createUser(userData: UserCreationAttributes): Promise<User> {
    try {
      const newUser = new User({ ...userData });
      const user = await newUser.save();
      return user;
    } catch (error: any) {
      this.logger.error(`UserService.createUser: ${error.message}`);
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new BadRequestException("User with this email already exists");
      }
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
  //get user by email
  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { email } });
      return user ? (user.toJSON() as User) : null;
    } catch (error: any) {
      this.logger.error(`UserService.getUserByEmail: ${error.message}`);
      throw error;
    }
  }
  public async isValidPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default UserService;
