import Container from "typedi";
import { Logger } from "../services/logger.service";
import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";
import AddUserDto from "../dtos/AddUser.dto";
import User, { RoleNames, UserCreationAttributes } from "../models/user";

class UserController {
  private logger: Logger = Container.get(Logger);
  private userService: UserService;
  private constructor(userService: UserService) {
    this.userService = userService;
  }

  public static init = async (): Promise<UserController> => {
    const service = await UserService.init();
    return new UserController(service);
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const payload = req.body as AddUserDto;

      const userObj: UserCreationAttributes = {
        ...payload,
        hashedPassword: payload.password,
        isAdmin: false,
        role: RoleNames.CUSTOMER,
      };
      const user = await this.userService.createUser(userObj);
      const userData = user.toJSON();
      return res.status(201).json({
        message: "User registered successfully",
        user: userData,
      });
    } catch (error: any) {
      this.logger.error(`UserController.createUser: ${error.message}`);
      next(error);
    }
  };
}
export default UserController;
