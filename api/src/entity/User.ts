import { argon2id, hash, verify } from "argon2";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  async setPassword(password: string): Promise<this> {
    this.passwordHash = await hash(password, { type: argon2id });
    return this;
  }

  async verifyPassword(password?: string | null): Promise<boolean> {
    if (!this.passwordHash || !password) {
      return false;
    }
    try {
      return await verify(this.passwordHash, password);
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
