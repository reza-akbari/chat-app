import { config } from "dotenv";
config();

export const JWT_SECRET = process.env.JWT_SECRET;

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

export const ACCESS_TOKEN_EXP_SECONDS = 10 * 60; // 10 minutes
export const REFRESH_TOKEN_EXP_SECONDS = 365 * 24 * 60 * 60; // 1 year
export const REFRESH_TOKEN_OPTIONS = {
  httpOnly: true,
  secure: true,
  path: "/auth/refresh",
} as const;
