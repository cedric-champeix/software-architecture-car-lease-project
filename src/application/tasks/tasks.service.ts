import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContractService } from 'src/domain/services/contract.service';

@Injectable()
export class TasksService {
  constructor(private readonly contractService: ContractService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.contractService.handleOverdueContracts();
  }
}
