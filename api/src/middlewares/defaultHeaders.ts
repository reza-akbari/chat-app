import { RequestHandler } from "express";
import { CLIENT_ORIGIN } from "../const";

export const defaultHeaders: RequestHandler = (_req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, private",

    "Access-Control-Allow-Origin": CLIENT_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, PATCH, DELETE",
  });
  next();
};
