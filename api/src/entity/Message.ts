import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { formatMessage } from "../utils/formatMessage";
import { wss } from "../wss";
import { User } from "./User";

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @AfterInsert()
  async emitNewMessage() {
    if (!this.user) {
      this.user = await User.findOneByOrFail({ id: this.userId });
    }
    wss.clients.forEach((ws) => ws.send(JSON.stringify(formatMessage(this))));
  }
}
