import Redis from "ioredis";
import env from "../config/env.config";
import { Logger } from "./logger.service";

const logger = new Logger();

export class RedisService {
  private static client: Redis | null = null;

  // Get Redis client (Singleton)
  public static getClient(): Redis {
    if (!this.client) {
      this.client = new Redis({
        host: env.REDIS.HOST,
        port: env.REDIS.PORT,
        password: env.REDIS.PASSWORD,
      });
      this.handleClientListeners();
    }
    return this.client;
  }

  // Add event listeners for Redis connection
  private static handleClientListeners() {
    if (!this.client) return;

    this.client.on("connect", () => {
      logger.info("Connected to Redis successfully!");
    });

    this.client.on("error", (err) => {
      logger.error(`Error connecting to Redis: ${err.message}`);
    });
  }

  // Set value in Redis with optional expiration
  public static async setValue(
    key: string,
    value: string,
    expiration?: number,
  ) {
    try {
      if (!this.client) this.getClient(); // Ensure Redis is initialized
      if (expiration) {
        await this.client!.set(key, value, "EX", expiration);
      } else {
        await this.client!.set(key, value);
      }
      logger.info(`Set key ${key} with value ${value}`);
    } catch (err: any) {
      logger.error(`Error setting key ${key}: ${err.message}`);
    }
  }

  // Get value from Redis
  public static async getValue(key: string) {
    try {
      if (!this.client) this.getClient();
      const value = await this.client!.get(key);
      logger.info(`Get key ${key} returned value ${value}`);
      return value;
    } catch (err: any) {
      logger.error(`Error getting key ${key}: ${err.message}`);
      return null;
    }
  }
}
