import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Status } from './status.entity';
import { User } from './user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', nullable: true, unique: true })
  public forgotToken: string;

  @Column({ type: 'enum', enum: Status })
  public status: Status;

  @ManyToOne(() => User, (account) => account.tokens)
  @JoinColumn({ name: 'user' })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
