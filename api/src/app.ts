import { json } from "body-parser";
import { authSetup } from "./middlewares/authSetup";
import { defaultHeaders } from "./middlewares/defaultHeaders";
import { authRoutes } from "./routes/authRoutes";
import { messageRoutes } from "./routes/messageRoutes";
import express = require("express");

export const app = express();
app.use(json());
app.use(authSetup);
app.use(defaultHeaders);
authRoutes(app);
messageRoutes(app);
