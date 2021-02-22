import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './tasks.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterTaskDto: FilterTaskDto, user: User): Promise<Task[]> {
    const { status, search } = filterTaskDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%{search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filter: "${filterTaskDto}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const { title, description } = createTaskDto;
      const task = new Task();
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN;
      task.user = user;
      await task.save();

      delete task.user;
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user "${user.username}", Data: ${createTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
