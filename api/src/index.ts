import { json } from "body-parser";
import { AppDataSource } from "./data-source";
import { authSetup } from "./middlewares/authSetup";
import { defaultHeaders } from "./middlewares/defaultHeaders";
import { authRoutes } from "./routes/authRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import express = require("express");

const app = express();
app.use(json());
app.use(authSetup);
app.use(defaultHeaders);
authRoutes(app);
messageRoutes(app);

AppDataSource.initialize()
  .then(async () => {
    app.listen(3500, () => console.log("api is running"));
  })
  .catch((error) => console.log(error));
