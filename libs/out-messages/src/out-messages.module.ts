import { Global, Module } from '@nestjs/common';

import { VehicleMaintenanceProducerModule } from './producers/vehicle-maintenance/vehicle-maintenance.module';

@Global()
@Module({})
export class OutMessagesModule {
  static register(options: { enableProducers: boolean }) {
    return {
      exports: [VehicleMaintenanceProducerModule],
      imports: [
        VehicleMaintenanceProducerModule.register({
          enabled: options.enableProducers,
        }),
      ],
      module: OutMessagesModule,
    };
  }
}
