import { HandleOverdueContractsUseCase } from '@lib/domain/use-cases/contract/handle-overdue-contracts';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    private readonly handleOverdueContractsUseCase: HandleOverdueContractsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.handleOverdueContractsUseCase.execute();
  }
}
