import { createServer } from "http";
import { app } from "./app";
import { AppDataSource } from "./data-source";
import { onUpgrade } from "./wss";

const server = createServer(app);
server.on("upgrade", onUpgrade);

AppDataSource.initialize()
  .then(async () => {
    server.listen(3500, () => console.log("api is running"));
  })
  .catch((error) => console.log(error));
