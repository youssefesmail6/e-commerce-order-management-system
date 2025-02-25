import express, { Application, Request, Response, NextFunction } from "express";
import env, { envSchema } from "./config/env.config";
import { Logger } from "./services/logger.service";
import { RedisService } from './services/redis.service';
import Container from "typedi";
import cors from "cors";
import getRouters from "./routes/index.routes";
import { connectDB } from "./config/db.config";
import ErrorHandlerMiddleware from "./middlewares/error-handler.middleware";

class App {
  private app!: Application;
  private logger: Logger = Container.get(Logger);
  public corsOptions: cors.CorsOptions = {
    origin: "*",
    allowedHeaders: "*",
    methods: "*",
  };

  private constructor() {}

  public static async init(): Promise<App> {
    const appInstance = new App();
    appInstance.validateEnv();
    appInstance.app = express();
    appInstance.initializeMiddlewares();
    await connectDB();
    await appInstance.initializeRoutes();
    appInstance.errorHandler();
    RedisService.getClient();
    return appInstance;
  }

  private validateEnv() {
    const { error } = envSchema.validate(env);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Test route to check JSON response
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "Hello World!" });
    });
  }

  private async initializeRoutes() {
    const routers = await getRouters();
    for (const router of routers) {
      this.app.use("/api", router);
    }
  }

  private errorHandler() {
    this.app.use(ErrorHandlerMiddleware);
  }

  public listen() {
    this.app.listen(env.APP.PORT, () => {
      this.logger.info(
        `🚀 Server is running at http://localhost:${env.APP.PORT}`,
      );
    });
  }
}

export default App;
