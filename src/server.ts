import App from "./app";
import Container from "typedi";
import { Logger } from "./services/logger.service";
import { exit } from "process";
import UserService from "./services/user.service";
import env from "./config/env.config";
import { AdminCreationAttributes } from "./models/user";

const logger = Container.get(Logger);

const createAdminUserIfNotExists = async () => {
  const userService = await UserService.init();
  const userCounter = await userService.countUsers();
  
  // Check if any user exists. If none exists, create the admin.
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
    app.listen();
  } catch (err: any) {
    logger.error(err.message);
    exit(1);
  }
};
startApplication();
