import { Container } from "typedi";
import { Logger } from "../services/logger.service";
import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { LoginDto } from "../dtos/login.dto";

class AuthController {
    private authService: AuthService;
    private userService: UserService;
    private logger: Logger = Container.get(Logger);
  
    private constructor(authService: AuthService, userService: UserService) {
      this.authService = authService;
      this.userService = userService;
    }
  
    public static init = async (): Promise<AuthController> => {
      const service = await AuthService.init();
      const userService = await UserService.init();
      return new AuthController(service, userService);
    };
  
    public login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const resource = await this.authService.login(email, password);
        res.json(resource);
      } catch (err: any) {
        this.logger.error(`AuthController.login: ${err.message}`);
        next(err);
      }
    };
}

export default  AuthController;
