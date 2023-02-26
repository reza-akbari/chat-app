import cookieParser = require("cookie-parser");
import type { Express } from "express";
import { ACCESS_TOKEN_EXP_SECONDS } from "../const";
import { User } from "../entity/User";
import { asyncRoute } from "../utils/asyncRoute";
import { clearRefreshToken } from "../utils/clearRefreshToken";
import { jwtParse, jwtTokenize } from "../utils/jwt";
import { setRefreshCookie } from "../utils/setRefreshCookie";

export const authRoutes = (app: Express) => {
  app.post("/auth/sign-in", (req, res) => {
    asyncRoute(res, async () => {
      let { password, name } = req.body;
      password = String(password);
      name = String(name);

      const user = await User.findOneBy({ name });
      if (!user || !(await user.verifyPassword(password))) {
        res.sendStatus(400);
        return;
      }

      const accessToken = jwtTokenize(
        { id: user.id },
        ACCESS_TOKEN_EXP_SECONDS
      );
      setRefreshCookie(res, user.id);
      res.json({ accessToken });
    });
  });

  app.post("/auth/sign-up", (req, res) => {
    asyncRoute(res, async () => {
      let { password, name } = req.body;
      password = String(password);
      name = String(name);

      const existingUser = await User.findOneBy({ name });
      if (existingUser) {
        res.json({ nameIsTaken: true });
        return;
      }

      const user = User.create({ name });
      await user.setPassword(password);
      await user.save();

      const accessToken = jwtTokenize(
        { id: user.id },
        ACCESS_TOKEN_EXP_SECONDS
      );
      setRefreshCookie(res, user.id);
      res.json({ accessToken });
    });
  });

  app.post("/auth/refresh", cookieParser(), (req, res) => {
    const payload = jwtParse(req.cookies["refresh-token"]);
    if (!payload || !payload.id) {
      clearRefreshToken(res);
      res.json({});
      return;
    }
    const accessToken = jwtTokenize(
      { id: payload.id },
      ACCESS_TOKEN_EXP_SECONDS
    );
    setRefreshCookie(res, payload.id);
    res.json({ accessToken });
  });

  app.post("/auth/sign-out", (_req, res) => {
    clearRefreshToken(res);
    res.json({});
  });
};
