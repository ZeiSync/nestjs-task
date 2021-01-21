import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './tasks.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
    try {
      const { status, search } = filterTaskDto;

      const query = this.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          'task.title LIKE :search OR task.description LIKE :search',
          { search: `%{search}%` },
        );
      }

      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      return error;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const task = await this.findOne({ id });

      if (!task) {
        throw new NotFoundException(`task_with_${id}_not_found`);
      }

      return task;
    } catch (error) {
      return error;
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { title, description } = createTaskDto;
      const task = new Task();
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN;
      await task.save();

      return task;
    } catch (error) {
      return error;
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    try {
      const { status } = updateTaskDto;
      const task = await this.getTaskById(id);
      task.status = status;
      await task.save();
      return task;
    } catch (error) {
      return error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const result = await this.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`task_with_${id}_not_found`);
      }
    } catch (error) {
      return error;
    }
  }
}
