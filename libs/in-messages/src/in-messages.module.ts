import { Module } from '@nestjs/common';
import { VehicleMaintenanceConsumerModule } from 'src/vehicle/vehicle-maintenance.module';

@Module({
  imports: [VehicleMaintenanceConsumerModule],
})
export class InMessagesModule {}
