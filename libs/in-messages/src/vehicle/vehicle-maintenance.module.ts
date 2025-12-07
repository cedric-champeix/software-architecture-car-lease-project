import { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import { OutMongooseModule } from '@lib/out-mongoose';
import { ContractMongooseRepository } from '@lib/out-mongoose/repositories/contract.mongoose.repository';
import { VehicleMongooseRepository } from '@lib/out-mongoose/repositories/vehicle.mongoose.repository';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { VehicleMaintenanceConsumer } from './vehicle-maintenance.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: 'vehicle' }), OutMongooseModule],
  providers: [
    VehicleMaintenanceConsumer,
    {
      inject: [ContractMongooseRepository, VehicleMongooseRepository],
      provide: CancelContractsForVehicleInMaintenanceUseCase,
      useFactory: (
        contractRepository: ContractMongooseRepository,
        vehicleRepository: VehicleMongooseRepository,
      ) => {
        return new CancelContractsForVehicleInMaintenanceUseCase(
          contractRepository,
          vehicleRepository,
        );
      },
    },
  ],
})
export class VehicleMaintenanceConsumerModule {}
