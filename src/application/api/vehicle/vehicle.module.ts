import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleController } from './vehicle.controller';
import { CreateVehicleUseCase } from 'src/domain/use-cases/vehicle/create-vehicle.use-case';
import { FindAllVehiclesUseCase } from 'src/domain/use-cases/vehicle/find-all-vehicles.use-case';
import { FindVehicleUseCase } from 'src/domain/use-cases/vehicle/find-vehicle.use-case';
import { UpdateVehicleUseCase } from 'src/domain/use-cases/vehicle/update-vehicle.use-case';
import { DeleteVehicleUseCase } from 'src/domain/use-cases/vehicle/delete-vehicle.use-case';
import { VehicleMongooseRepository } from 'src/infrastructure/persistence/mongoose/repositories/vehicle.mongoose.repository';
import {
  VehicleModel,
  VehicleSchema,
} from 'src/infrastructure/persistence/mongoose/schemas/vehicle.schema';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleModel.name, schema: VehicleSchema },
    ]),
    forwardRef(() => ContractModule),
  ],
  controllers: [VehicleController],
  providers: [
    CreateVehicleUseCase,
    FindAllVehiclesUseCase,
    FindVehicleUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
    {
      provide: 'VehicleRepository',
      useClass: VehicleMongooseRepository,
    },
  ],
  exports: [
    {
      provide: 'VehicleRepository',
      useClass: VehicleMongooseRepository,
    },
  ],
})
export class VehicleModule {}
