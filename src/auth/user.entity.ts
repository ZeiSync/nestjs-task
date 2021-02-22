import { Exclude } from 'class-transformer';
import { Task } from '../tasks/tasks.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
