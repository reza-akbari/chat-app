import type { RequestHandler } from "express";
import { jwtParse } from "../utils/jwt";

declare global {
  namespace Express {
    export interface Request {
      user?: { id: number };
    }
  }
}

export const authSetup: RequestHandler = (req, _res, next) => {
  const { authorization } = req.headers;
  const [, token] = authorization?.split(" ") || [];
  const payload = token && jwtParse(token);
  if (payload && payload.id) {
    req.user = { id: payload.id };
  }
  next();
};
