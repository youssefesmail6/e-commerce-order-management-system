import jwt from "jsonwebtoken";
import UnauthorizedException from "../exceptions/unauthorized.exception";
import env from "../config/env.config";
import { Logger } from "./logger.service";
import Container from "typedi";
import UserService from "./user.service";
import { JwtDto } from "../dtos/jwt.dto";
import NotFoundException from "../exceptions/not-found.exception";

class AuthService {
  private userService: UserService;
  private logger: Logger = Container.get(Logger);

  private constructor(userService: UserService) {
    this.userService = userService;
  }

  public static async init(): Promise<AuthService> {
    const userService = await UserService.init();

    return new AuthService(userService);
  }

  public generateAccessToken(payload: JwtDto): string {
    const token = jwt.sign(payload, env.AUTH.SECRET as string, {
      expiresIn: Number(env.AUTH.EXPIRATION),
    });
    return token;
  }

  public async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    try {
      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const isValid = await this.userService.isValidPassword(
        password,
        user.hashedPassword,
      );

      if (!isValid) {
        throw new UnauthorizedException("Invalid Password");
      }

      // Generate access token
      const accessToken = this.generateAccessToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });

      return { accessToken };
    } catch (error: any) {
      this.logger.error(`Login error for email.login: ${error.message}`);
      throw error;
    }
  }
}

export default AuthService;
