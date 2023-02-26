import { IncomingMessage } from "http";
import { WebSocketServer } from "ws";
import { jwtParse } from "./utils/jwt";
import internal = require("stream");

declare module "ws" {
  interface WebSocket {
    isAlive?: boolean;
  }
}

export const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });
  ws.on("error", console.error);
  ws.on("message", (data) => {
    console.log(`message: ${data.toString()}`);
  });
});

const healthInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30 * 1000);

wss.on("close", () => clearInterval(healthInterval));

export const onUpgrade = (
  req: IncomingMessage,
  socket: internal.Duplex,
  head: Buffer
) => {
  const token = req.url?.slice(1);
  if (!token || !jwtParse(token)) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
};
