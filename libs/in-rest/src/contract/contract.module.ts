import { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import { CreateContractUseCase } from '@lib/domain/use-cases/contract/create-contract';
import { DeleteContractUseCase } from '@lib/domain/use-cases/contract/delete-contract';
import { FindAllContractsUseCase } from '@lib/domain/use-cases/contract/find-all-contracts';
import { FindContractUseCase } from '@lib/domain/use-cases/contract/find-contract';
import { HandleOverdueContractsUseCase } from '@lib/domain/use-cases/contract/handle-overdue-contracts';
import { UpdateContractUseCase } from '@lib/domain/use-cases/contract/update-contract';
import { OutMongooseModule } from '@lib/out-mongoose/out-mongoose.module';
import { ClientMongooseRepository } from '@lib/out-mongoose/repositories/client.mongoose.repository';
import { ContractMongooseRepository } from '@lib/out-mongoose/repositories/contract.mongoose.repository';
import { VehicleMongooseRepository } from '@lib/out-mongoose/repositories/vehicle.mongoose.repository';
import { forwardRef, Module } from '@nestjs/common';

import { ClientModule } from '../client/client.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ContractController } from './contract.controller';

@Module({
  controllers: [ContractController],
  exports: [
    CancelContractsForVehicleInMaintenanceUseCase,
    HandleOverdueContractsUseCase,
  ],
  imports: [OutMongooseModule, ClientModule, forwardRef(() => VehicleModule)],
  providers: [
    {
      inject: [
        ContractMongooseRepository,
        ClientMongooseRepository,
        VehicleMongooseRepository,
      ],
      provide: CreateContractUseCase,
      useFactory: (
        contractRepository: ContractMongooseRepository,
        clientRepository: ClientMongooseRepository,
        vehicleRepository: VehicleMongooseRepository,
      ) => {
        return new CreateContractUseCase(
          contractRepository,
          clientRepository,
          vehicleRepository,
        );
      },
    },
    {
      inject: [ContractMongooseRepository],
      provide: FindAllContractsUseCase,
      useFactory: (contractRepository: ContractMongooseRepository) => {
        return new FindAllContractsUseCase(contractRepository);
      },
    },
    {
      inject: [ContractMongooseRepository],
      provide: FindContractUseCase,
      useFactory: (contractRepository: ContractMongooseRepository) => {
        return new FindContractUseCase(contractRepository);
      },
    },
    {
      inject: [ContractMongooseRepository],
      provide: UpdateContractUseCase,
      useFactory: (contractRepository: ContractMongooseRepository) => {
        return new UpdateContractUseCase(contractRepository);
      },
    },
    {
      inject: [ContractMongooseRepository],
      provide: DeleteContractUseCase,
      useFactory: (contractRepository: ContractMongooseRepository) => {
        return new DeleteContractUseCase(contractRepository);
      },
    },
    {
      inject: [ContractMongooseRepository],
      provide: CancelContractsForVehicleInMaintenanceUseCase,
      useFactory: (contractRepository: ContractMongooseRepository) => {
        return new CancelContractsForVehicleInMaintenanceUseCase(
          contractRepository,
        );
      },
    },
    {
      inject: [ContractMongooseRepository],
      provide: HandleOverdueContractsUseCase,
      useFactory: (contractRepository: ContractMongooseRepository) => {
        return new HandleOverdueContractsUseCase(contractRepository);
      },
    },
  ],
})
export class ContractModule {}
