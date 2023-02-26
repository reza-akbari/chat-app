import { sign, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../const";

export const jwtTokenize = (payload: Object, expireSeconds: number): string => {
  return sign(payload, JWT_SECRET, {
    expiresIn: expireSeconds,
  });
};

export const jwtParse = (token: string): any | undefined => {
  try {
    return verify(token, JWT_SECRET);
  } catch (e) {}
};
