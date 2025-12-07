import { Module } from '@nestjs/common';

import { VehicleMaintenanceConsumerModule } from './vehicle/vehicle-maintenance.module';

@Module({})
export class InMessagesModule {
  static register(options: { enableConsumers: boolean }) {
    return {
      imports: options.enableConsumers
        ? [VehicleMaintenanceConsumerModule]
        : [],
      module: InMessagesModule,
    };
  }
}
