import { Message } from "../entity/Message";

export const formatMessage = (m: Message) => ({
  id: m.id,
  content: m.content,
  createdAt: m.createdAt.toLocaleString(["fa-IR"], {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tehran",
  }),
  user: {
    id: m.user.id,
    name: m.user.name,
  },
});
