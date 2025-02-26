import App from "./app";
import Container from "typedi";
import { Logger } from "./services/logger.service";
import { exit } from "process";
import UserService from "./services/user.service";
import env from "./config/env.config";
import { AdminCreationAttributes } from "./models/user";
import WebSocketService from "./services/websocket.service";
import { createServer } from "http";

const logger = Container.get(Logger);

const createAdminUserIfNotExists = async () => {
  const userService = await UserService.init();
  const userCounter = await userService.countUsers();

  if (userCounter === 0) {
    const newUser: AdminCreationAttributes = {
      email: env.ADMIN.EMAIL as string,
      hashedPassword: env.ADMIN.PASSWORD as string,
      name: env.ADMIN.NAME as string,
      isAdmin: true,
    };

    await userService.createAdminUser(newUser);
    logger.info("Admin user created successfully");
  } else {
    logger.info("Admin user already exists");
  }
};

const startApplication = async () => {
  try {
    const app = await App.init();
    await createAdminUserIfNotExists();

    const server = createServer(app.getExpressInstance());

    const websocketService = Container.get(WebSocketService);
    websocketService.initialize(server);

    server.listen(env.APP.PORT, () => {
      logger.info(`🚀 Server is running at http://localhost:${env.APP.PORT}`);
    });

  } catch (err: any) {
    logger.error(`Error starting application: ${err.message}`);
    exit(1);
  }
};

startApplication();
