import { Module } from '@nestjs/common';
import { VehicleMaintenanceProducerModule } from 'src/producers/vehicle-maintenance/vehicle-maintenance.module';

@Module({
  exports: [VehicleMaintenanceProducerModule],
  imports: [VehicleMaintenanceProducerModule],
})
export class OutMessagesModule {}
