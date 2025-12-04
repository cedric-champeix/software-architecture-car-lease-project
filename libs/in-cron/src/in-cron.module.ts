import { ContractRepository } from '@lib/domain/repositories/contract.repository';
import { HandleOverdueContractsUseCase } from '@lib/domain/use-cases/contract/handle-overdue-contracts';
import { OutMongooseModule } from '@lib/out-mongoose/out-mongoose.module';
import { ContractMongooseRepository } from '@lib/out-mongoose/repositories/contract.mongoose.repository';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { TasksService } from './tasks.service';

@Module({
  exports: [TasksService],
  imports: [ScheduleModule.forRoot(), OutMongooseModule],
  providers: [
    TasksService,
    {
      inject: [ContractMongooseRepository],
      provide: HandleOverdueContractsUseCase,
      useFactory: (contractRepository: ContractRepository) => {
        return new HandleOverdueContractsUseCase(contractRepository);
      },
    },
  ],
})
export class InCronModule {}
