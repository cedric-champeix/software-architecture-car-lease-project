import { VehicleMaintenanceProducer as VehicleMaintenanceAbstractProducer } from '@lib/domain/producers/vehicle-maintenance.producer';
import { CreateVehicleUseCase } from '@lib/domain/use-cases/vehicle/create-vehicle';
import { DeleteVehicleUseCase } from '@lib/domain/use-cases/vehicle/delete-vehicle';
import { FindAllVehiclesUseCase } from '@lib/domain/use-cases/vehicle/find-all-vehicles';
import { FindVehicleUseCase } from '@lib/domain/use-cases/vehicle/find-vehicle';
import { UpdateVehicleUseCase } from '@lib/domain/use-cases/vehicle/update-vehicle';
import { OutMessagesModule } from '@lib/out-messages/out-messages.module';
import { OutMongooseModule } from '@lib/out-mongoose/out-mongoose.module';
import { VehicleMongooseRepository } from '@lib/out-mongoose/repositories/vehicle.mongoose.repository';
import { forwardRef, Module } from '@nestjs/common';

import { ContractModule } from '../contract/contract.module';
import { VehicleController } from './vehicle.controller';

@Module({
  controllers: [VehicleController],
  exports: [
    CreateVehicleUseCase,
    DeleteVehicleUseCase,
    FindAllVehiclesUseCase,
    FindVehicleUseCase,
    UpdateVehicleUseCase,
  ],
  imports: [
    OutMongooseModule,
    forwardRef(() => ContractModule),
    OutMessagesModule,
  ],
  providers: [
    {
      inject: [VehicleMongooseRepository],
      provide: CreateVehicleUseCase,
      useFactory: (vehicleRepository: VehicleMongooseRepository) => {
        return new CreateVehicleUseCase(vehicleRepository);
      },
    },
    {
      inject: [VehicleMongooseRepository],
      provide: DeleteVehicleUseCase,
      useFactory: (vehicleRepository: VehicleMongooseRepository) => {
        return new DeleteVehicleUseCase(vehicleRepository);
      },
    },
    {
      inject: [VehicleMongooseRepository],
      provide: FindAllVehiclesUseCase,
      useFactory: (vehicleRepository: VehicleMongooseRepository) => {
        return new FindAllVehiclesUseCase(vehicleRepository);
      },
    },
    {
      inject: [VehicleMongooseRepository],
      provide: FindVehicleUseCase,
      useFactory: (vehicleRepository: VehicleMongooseRepository) => {
        return new FindVehicleUseCase(vehicleRepository);
      },
    },
    {
      inject: [VehicleMongooseRepository, VehicleMaintenanceAbstractProducer],
      provide: UpdateVehicleUseCase,
      useFactory: (
        vehicleRepository: VehicleMongooseRepository,
        vehicleMaintenanceProducer: VehicleMaintenanceAbstractProducer,
      ) => {
        return new UpdateVehicleUseCase(
          vehicleRepository,
          vehicleMaintenanceProducer,
        );
      },
    },
  ],
})
export class VehicleModule {}
