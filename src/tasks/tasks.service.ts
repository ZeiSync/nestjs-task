import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterTaskDto: FilterTaskDto, user: User): Promise<Task[]> {
    try {
      return await this.taskRepository.getTasks(filterTaskDto, user);
    } catch (error) {
      return error;
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });

      if (!task) {
        throw new NotFoundException(`task_with_${id}_not_found`);
      }

      return task;
    } catch (error) {
      return error;
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      return await this.taskRepository.createTask(createTaskDto, user);
    } catch (error) {
      throw new Error(error.stack);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    try {
      const { status } = updateTaskDto;
      const task = await this.getTaskById(id, user);
      task.status = status;
      await task.save();
      return task;
    } catch (error) {
      return error;
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      const result = await this.taskRepository.delete({ id, userId: user.id });

      if (result.affected === 0) {
        throw new NotFoundException(`task_with_${id}_not_found`);
      }
    } catch (error) {
      return error;
    }
  }
}
