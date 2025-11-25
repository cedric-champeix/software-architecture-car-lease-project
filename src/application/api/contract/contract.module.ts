import { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance.use-case';
import { CreateContractUseCase } from '@lib/domain/use-cases/contract/create-contract.use-case';
import { DeleteContractUseCase } from '@lib/domain/use-cases/contract/delete-contract.use-case';
import { FindAllContractsUseCase } from '@lib/domain/use-cases/contract/find-all-contracts.use-case';
import { FindContractUseCase } from '@lib/domain/use-cases/contract/find-contract.use-case';
import { HandleOverdueContractsUseCase } from '@lib/domain/use-cases/contract/handle-overdue-contracts.use-case';
import { UpdateContractUseCase } from '@lib/domain/use-cases/contract/update-contract.use-case';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractMongooseRepository } from 'src/infrastructure/persistence/mongoose/repositories/contract.mongoose.repository';
import {
  ContractModel,
  ContractSchema,
} from 'src/infrastructure/persistence/mongoose/schemas/contract.schema';

import { ClientModule } from '../client/client.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ContractController } from './contract.controller';

@Module({
  controllers: [ContractController],
  exports: [
    CancelContractsForVehicleInMaintenanceUseCase,
    HandleOverdueContractsUseCase,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ContractModel.name, schema: ContractSchema },
    ]),
    ClientModule,
    forwardRef(() => VehicleModule),
  ],
  providers: [
    CreateContractUseCase,
    FindAllContractsUseCase,
    FindContractUseCase,
    UpdateContractUseCase,
    DeleteContractUseCase,
    CancelContractsForVehicleInMaintenanceUseCase,
    HandleOverdueContractsUseCase,
    {
      provide: 'ContractRepository',
      useClass: ContractMongooseRepository,
    },
  ],
})
export class ContractModule {}
