import { VehicleMaintenanceProducer as VehicleMaintenanceAbstractProducer } from '@lib/domain/producers/vehicle-maintenance.producer';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueNames } from 'src/enum/queue-names';

import { VehicleMaintenanceProducer } from './vehicle-maintenance.producer';

@Module({
  exports: [VehicleMaintenanceAbstractProducer],
  imports: [BullModule.registerQueue({ name: QueueNames.VehicleMaintenance })],
  providers: [
    {
      provide: VehicleMaintenanceAbstractProducer,
      useClass: VehicleMaintenanceProducer,
    },
  ],
})
export class VehicleMaintenanceProducerModule {}
