import { Response } from "express";
import { REFRESH_TOKEN_EXP_SECONDS, REFRESH_TOKEN_OPTIONS } from "../const";
import { jwtTokenize } from "./jwt";

export const setRefreshCookie = (res: Response, userId: number) => {
  const refreshToken = jwtTokenize({ id: userId }, REFRESH_TOKEN_EXP_SECONDS);
  res.cookie("refresh-token", refreshToken, {
    expires: new Date(Date.now() + REFRESH_TOKEN_EXP_SECONDS * 1000),
    ...REFRESH_TOKEN_OPTIONS,
  });
};
