import { Sequelize, Model } from "sequelize-typescript";
import { Transaction } from "sequelize";
import fs from "fs/promises";
import path from "path";
import { dbConfig } from "../config/db.config";

class DBConnector {
  private static instance: Promise<DBConnector> | null = null;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize({
      database: dbConfig.database,
      username: dbConfig.username,
      password: dbConfig.password,
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: false,
      models: [],
    });
  }

  public static getInstance(): Promise<DBConnector> {
    if (!DBConnector.instance) {
      DBConnector.instance = (async () => {
        const instance = new DBConnector();
        await instance.initializeModels();
        return instance;
      })();
    }
    return DBConnector.instance;
  }

  private async initializeModels() {
    const models: any[] = [];
    const basename = path.basename(__filename);

    const files = await fs.readdir(__dirname);

    await Promise.all(
      files
        .filter((file) => {
          return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
          );
        })
        .map(async (file) => {
          const modelPath = path.join(__dirname, file);
          const { default: modelClass } = await import(modelPath);

          if (modelClass.prototype instanceof Model) {
            models.push(modelClass);
          }
        })
    );

    this.sequelize.addModels(models);
    await this.sequelize.sync();
    (this as any).db = this.sequelize.models;
  }

  public getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }

  public async getTransaction(): Promise<Transaction> {
    return this.sequelize.transaction();
  }

  public getModels() {
    return (this as any).db;
  }
}

export default DBConnector;
