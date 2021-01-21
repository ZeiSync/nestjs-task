import { IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  status: TaskStatus;
}
