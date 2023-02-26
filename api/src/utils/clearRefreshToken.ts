import { Response } from "express";
import { REFRESH_TOKEN_OPTIONS } from "../const";

export const clearRefreshToken = (res: Response) => {
  res.clearCookie("refresh-token", REFRESH_TOKEN_OPTIONS);
};
