import express, { Application, Request, Response } from "express";
import env, { envSchema } from "./config/env.config";
import { Logger } from "./services/logger.service";
import { RedisService } from "./services/redis.service";
import Container from "typedi";
import cors from "cors";
import getRouters from "./routes/index.routes";
import { connectDB } from "./config/db.config";
import ErrorHandlerMiddleware from "./middlewares/error-handler.middleware";
import { initWebSocket } from "./utils/webSocketClient"

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
    // Test route to trigger WebSocket connection
    this.app.get("/test-websocket/:userId", (req: Request, res: Response) => {
      const { userId } = req.params;

      // Initialize WebSocket with the given userId
      initWebSocket(userId);

      res.status(200).json({ message: `WebSocket initialized for user: ${userId}` });
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

  public getExpressInstance(): Application {
    return this.app;
  }
}

export default App;
