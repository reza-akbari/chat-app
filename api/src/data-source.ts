import { join } from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Message } from "./entity/Message";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: join(__dirname, "../../storage/api.sqlite"),
  synchronize: true,
  logging: false,
  entities: [User, Message],
  migrations: [],
  subscribers: [],
});
