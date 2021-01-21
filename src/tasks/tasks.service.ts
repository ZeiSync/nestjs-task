import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async getTasks(filterTaskDto: FilterTaskDto): Promise<Task[]> {
    try {
      return await this.taskRepository.getTasks(filterTaskDto);
    } catch (error) {
      return error;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      return await this.taskRepository.getTaskById(id);
    } catch (error) {
      return error;
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskRepository.createTask(createTaskDto);
    } catch (error) {
      return error;
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    try {
      return await this.taskRepository.updateTaskStatus(id, updateTaskDto);
    } catch (error) {
      return error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      return await this.taskRepository.deleteTask(id);
    } catch (error) {
      return error;
    }
  }
}
