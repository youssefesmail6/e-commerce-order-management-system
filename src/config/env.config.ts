import { config } from "dotenv";
config();
import * as Joi from "joi";

const env = {
  APP: {
    PORT: Number(process.env.APP_PORT) || 3001,
    URL: process.env.APP_URL || "http://localhost:3001",
    ENV: process.env.NODE_ENV || "production",
  },
  DB: {
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
  },
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL,
    NAME: process.env.ADMIN_NAME,
    PASSWORD: process.env.ADMIN_PASSWORD,
  },
  AUTH: {
    SECRET: process.env.AUTH_SECRET,
    EXPIRATION: process.env.AUTH_EXPIRATION,
  },
  REDIS: {
    URL: process.env.REDIS_URL,
      HOST: process.env.REDIS_HOST || 'localhost',
      PORT: Number(process.env.REDIS_PORT) || 6379,
      PASSWORD: process.env.REDIS_PASSWORD || '',
    },
    STRIPE: {
      SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
    },
    
  }

export const envSchema = Joi.object({
  APP: Joi.object({
    PORT: Joi.number().port().required(),
    URL: Joi.string().required(),
    ENV: Joi.string().valid("development", "production").required(),
  }),
  DB: Joi.object({
    HOST: Joi.string().required(),
    PORT: Joi.number().port().required(),
    NAME: Joi.string().required(),
    USER: Joi.string().required(),
    PASSWORD: Joi.string().required(),
  }),
  ADMIN: Joi.object({
    EMAIL: Joi.string().email().required(),
    NAME: Joi.string().required(),
    PASSWORD: Joi.string().required(),
  }),
  AUTH: Joi.object({
    SECRET: Joi.string().required(),
    EXPIRATION: Joi.string().required(),
  }),
  STRIPE: Joi.object({
    SECRET_KEY: Joi.string().required(),
  }),
  REDIS: Joi.object({
    URL: Joi.string().required(),
    HOST: Joi.string().required(),
    PORT: Joi.number().port().required(),
    PASSWORD: Joi.string().required(),
  }),
});

export default env;
