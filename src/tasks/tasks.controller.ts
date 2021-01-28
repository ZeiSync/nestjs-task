import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipes/update-status.pipes';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}
  @Get()
  async getTasks(
    @Query(ValidationPipe) filterTaskDto: FilterTaskDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    try {
      return await this.taskService.getTasks(filterTaskDto, user);
    } catch (error) {
      return error;
    }
  }

  @Get('/:id')
  async getTaskById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    try {
      return await this.taskService.getTaskById(id, user);
    } catch (error) {
      return error;
    }
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    try {
      return await this.taskService.createTask(createTaskDto, user);
    } catch (error) {
      return error;
    }
  }

  @Patch('/:id/status')
  @UsePipes(ValidationPipe)
  async updateTaskStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(TaskStatusValidationPipe) updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    try {
      return await this.taskService.updateTaskStatus(id, updateTaskDto, user);
    } catch (error) {
      return error;
    }
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  async deleteTask(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      return await this.taskService.deleteTask(id, user);
    } catch (error) {
      return error;
    }
  }
}
