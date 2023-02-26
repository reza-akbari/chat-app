import cookieParser = require("cookie-parser");
import type { Express } from "express";
import { LessThan } from "typeorm";
import { Message } from "../entity/Message";
import { authOnly } from "../middlewares/authOnly";
import { asyncRoute } from "../utils/asyncRoute";

const formateMessage = (m: Message) => ({
  id: m.id,
  content: m.content,
  createdAt: m.createdAt.toLocaleDateString("fa-IR", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Tehran",
  }),
  user: {
    id: m.user.id,
    name: m.user.name,
  },
});

export const messageRoutes = (app: Express) => {
  app.get("/messages", authOnly, (req, res) => {
    asyncRoute(res, async () => {
      const before = Number(req.query.before) || null;
      const messages = await Message.find({
        where: before ? { id: LessThan(before) } : undefined,
        order: { id: "desc" },
        take: 100,
        relations: { user: true },
      });
      res.json({ messages: messages.map(formateMessage) });
    });
  });

  app.post("/messages/new", authOnly, (req, res) => {
    asyncRoute(res, async () => {
      const { id: userId } = req.user!;
      let { content } = req.body as { content: string };
      content = String(content);
      if (content.length > 500) {
        res.status(422);
        res.json({ message: "متن پیام نمی تواند بیشتر از 500 کاراکتر باشد!" });
        return;
      }
      const message = Message.create({ userId, content });
      await message.save();
      res.json({ message: formateMessage(message) });
    });
  });
};