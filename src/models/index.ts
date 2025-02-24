import { Sequelize, Model } from "sequelize-typescript";
import fs from "fs/promises"; // Use the promise-based version of fs
import path from "path";
import { dbConfig } from "../config/db.config";

class DBConnector {
  private static instance: Promise<DBConnector> | null = null;
  private sequelize: Sequelize;

  private constructor() {
    // Initialize the Sequelize instance with `sequelize-typescript`
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

  // Static method to return the Singleton instance
  public static getInstance(): Promise<DBConnector> {
    if (!DBConnector.instance) {
      DBConnector.instance = (async () => {
        const instance = new DBConnector();
        await instance.initializeModels(); // Handle async initialization here
        return instance;
      })();
    }
    return DBConnector.instance;
  }

  // Async method to initialize the models using sequelize-typescript
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
        }),
    );

    // Add all the discovered models to the Sequelize instance
    this.sequelize.addModels(models);
    await this.sequelize.sync(); // Sync models to the database

    // Store the models on the instance for later access
    (this as any).db = this.sequelize.models;
  }

  // Example method to access the Sequelize instance
  public getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }

  // Example method to get the models
  public getModels() {
    return (this as any).db;
  }
}

export default DBConnector;
