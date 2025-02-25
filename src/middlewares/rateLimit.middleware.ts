import rateLimit from "express-rate-limit";

export const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 5 requests per windowMs
  message: "Too many accounts created from this IP, please try again later.",
  headers: true,
});
export const adminRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Allow 100 requests per window per admin
  message: "Too many requests from this admin, please try again later.",
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
