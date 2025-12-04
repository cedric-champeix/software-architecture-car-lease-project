import { Module } from '@nestjs/common';

import { ClientModule } from './client/client.module';
import { ContractModule } from './contract/contract.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  exports: [ClientModule, ContractModule, VehicleModule],
  imports: [ClientModule, ContractModule, VehicleModule],
})
export class InRestModule {}
