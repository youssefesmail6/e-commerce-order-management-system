import express, { Application, Request, Response } from "express";
import env, { envSchema } from "./config/env.config";
import { Logger } from "./services/logger.service";
import Container from "typedi";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config";

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
    appInstance.initializeRoutes();
    appInstance.errorHandler();
    return appInstance;
  }

  private errorHandler() {
    this.app.use((err: any, req: Request, res: Response, next: Function) => {
      this.logger.error(err.message);
      res.status(500).send("Something went wrong!");
    });
  }

  private validateEnv() {
    const { error } = envSchema.validate(env);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
  }

  private initializeMiddlewares() {
    this.app.use(cors(this.corsOptions));
    this.app.use(bodyParser.json());
  }

  private initializeRoutes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
    });
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
