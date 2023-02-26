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
        res.status(422);
        res.json({ message: "اطلاعات وارد شده صحیح نیست!" });
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
      let { password, name } = req.body as { password: string; name: string };
      password = String(password);
      name = String(name).trim();

      const existingUser = await User.findOneBy({ name });
      if (existingUser) {
        res.status(422);
        res.json({ message: "نام قبلا انتخاب شده است!" });
        return;
      }

      if (name.length < 3) {
        res.status(422);
        res.json({ message: "نام نمی تواند کمتر از 3 کاراکتر باشد!" });
        return;
      }
      if (name.length > 40) {
        res.status(422);
        res.json({ message: "نام نمی تواند بیشتر از 40 کاراکتر باشد!" });
        return;
      }
      if (password.length < 8) {
        res.status(422);
        res.json({ message: "کلمه عبور نمی تواند کمتر از 8 کاراکتر باشد!" });
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
