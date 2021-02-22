import { Test } from '@nestjs/testing';
import { TasksService } from "./tasks.service";
import { TaskRepository } from "./task.repository";
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const mockUser = { id: '123', username: 'SomeDude2', };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      // call taskService
      const filter: FilterTaskDto = { status: TaskStatus.OPEN, search: 'nothing' };
      const result = await tasksService.getTasks(filter, mockUser);
      // expect taskRepository.getTasks TO HAVE BEEN CALLED
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  })

  describe('getTaskById', () => {
    it('calls taskRepository.getTaskById() and successffuly retrive and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test desc' };
      taskRepository.findOne.mockResolvedValue(mockTask);
      expect(taskRepository.findOne).not.toHaveBeenCalled();
      const result = await tasksService.getTaskById('1', mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenLastCalledWith({ where: { id: '1', userId: mockUser.id } })
    });

    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById('1', mockUser)).resolves.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('create a new task and successfully create return task', async () => {
      const createTaskDto: CreateTaskDto = { title: 'Test task', description: 'Test desc' };
      taskRepository.createTask.mockResolvedValue(createTaskDto);
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
      expect(result).toEqual(createTaskDto);

    })
  })

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to de lete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask('1', mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: '1', userId: mockUser.id });

    });

    it('throws an error as task is not found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.deleteTask('1', mockUser)).resolves.toThrow(NotFoundException);
    });
  });

  describe('updatTask', () => {
    it('update status of task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.DONE
      }
      const save = jest.fn().mockResolvedValue(true);
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus('1', updateTaskDto, mockUser);
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    })
  })
})
