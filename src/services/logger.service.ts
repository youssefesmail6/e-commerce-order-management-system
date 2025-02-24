import { Service } from "typedi";
import * as winston from "winston";
import "winston-daily-rotate-file";

@Service()
export class Logger {
  private logger;
  private userLogger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, timestamp, message }) => {
          return `[${level.toUpperCase()}] ${timestamp} - ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: "logs/%DATE%/app-%DATE%.log",
          datePattern: "YYYY-MM-DD",
        }),
        new winston.transports.DailyRotateFile({
          filename: "logs/%DATE%/errors-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          level: "error",
        }),
      ],
    });

    this.userLogger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, timestamp, message }) => {
          return `[${level.toUpperCase()}] ${timestamp} - ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/user.log" }),
      ],
    });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public warning(message: string) {
    this.logger.warn(message);
  }

  public infoUser(message: string) {
    this.userLogger.info(message);
  }
}
