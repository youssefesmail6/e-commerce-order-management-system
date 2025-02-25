import rateLimit from "express-rate-limit";

export const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many accounts created from this IP, please try again later.",
  headers: true,
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Allow max 10 requests per 10 minutes
  message: "Too many login attempts, please try again later.",
  headers: true,
});

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Allow max 100 requests per minute
  message: "Too many requests, please slow down.",
  headers: true,
});
