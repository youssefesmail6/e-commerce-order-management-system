import { Dialect } from "sequelize";
import env from "./env.config";
import DBConnector from "../models";
import Container from "typedi";
import { Logger } from "../services/logger.service";

interface IConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
}

export const dbConfig: IConfig = {
  username: env.DB.USER as string,
  password: env.DB.PASSWORD as string,
  database: env.DB.NAME as string,
  host: env.DB.HOST as string,
  dialect: "postgres",
};

export const connectDB = async () => {
  const db = await DBConnector.getInstance();
  const logger = Container.get(Logger);
  try {
    await db.getSequelizeInstance().authenticate(); // Use the db instance to authenticate
    logger.info("🛰️  Database connection has been established successfully.");
    if (env.APP.ENV === "production") {
      logger.info("Syncing all migrations");
      await db.getSequelizeInstance().sync(); // Sync all models
      logger.info("✅ All migrations have been executed successfully.");
    }
  } catch (error: any) {
    logger.error(`❌ Unable to connect to the database: ${error.message}`);
    throw error;
  }
};
