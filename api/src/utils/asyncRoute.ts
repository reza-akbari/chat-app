import { Response } from "express";

export const asyncRoute = (res: Response, handler: () => Promise<void>) => {
  handler().catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
};
