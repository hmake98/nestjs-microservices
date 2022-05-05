import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public content: string;

  @Column({ type: 'int', nullable: true })
  public createdBy: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
