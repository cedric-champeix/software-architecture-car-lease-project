import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { VehicleMaintenanceConsumer } from './vehicle-maintenance.consumer';

@Module({
  imports: [BullModule.registerQueue({ name: 'vehicle' })],
  providers: [VehicleMaintenanceConsumer],
})
export class VehicleMaintenanceConsumerModule {}
