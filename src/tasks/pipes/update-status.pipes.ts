import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowStatus = [
    TaskStatus.DONE,
    TaskStatus.ON_GOING,
    TaskStatus.OPEN,
  ];

  transform(value: any) {
    const { status } = value;

    if (!this.isMatchTaskStatus(status.toUpperCase())) {
      throw new BadRequestException(`${status}_is_an_invalid_status`);
    }

    return value;
  }

  private isMatchTaskStatus(status: any) {
    const idx = this.allowStatus.indexOf(status);
    return idx !== -1;
  }
}
