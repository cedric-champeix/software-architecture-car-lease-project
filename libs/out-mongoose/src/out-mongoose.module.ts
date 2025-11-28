import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientMongooseRepository } from './repositories/client.mongoose.repository';
import { ContractMongooseRepository } from './repositories/contract.mongoose.repository';
import { VehicleMongooseRepository } from './repositories/vehicle.mongoose.repository';
import { ClientModel, ClientSchema } from './schemas/client.schema';
import { ContractModel, ContractSchema } from './schemas/contract.schema';
import { VehicleModel, VehicleSchema } from './schemas/vehicle.schema';

@Module({
  exports: [
    ClientMongooseRepository,
    ContractMongooseRepository,
    VehicleMongooseRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ClientModel.name, schema: ClientSchema },
      { name: ContractModel.name, schema: ContractSchema },
      { name: VehicleModel.name, schema: VehicleSchema },
    ]),
  ],
  providers: [
    ClientMongooseRepository,
    ContractMongooseRepository,
    VehicleMongooseRepository,
  ],
})
export class OutMongooseModule {}
