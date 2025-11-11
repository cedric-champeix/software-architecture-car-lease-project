import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContractService } from 'src/domain/services/contract.service';

@Injectable()
export class TasksService {
  constructor(private readonly contractService: ContractService) {}

  @Cron('0 0 * * *') // Runs every day at midnight
  handleCron() {
    this.contractService.handleOverdueContracts();
  }
}
