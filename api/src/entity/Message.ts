import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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
}
