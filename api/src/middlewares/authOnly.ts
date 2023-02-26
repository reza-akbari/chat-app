import type { RequestHandler } from "express";

export const authOnly: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  next();
};
