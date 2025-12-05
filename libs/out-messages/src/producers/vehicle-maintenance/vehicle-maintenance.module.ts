import { VehicleMaintenanceProducer as VehicleMaintenanceAbstractProducer } from '@lib/domain/producers/vehicle-maintenance.producer';
import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { QueueNames } from '../../enum/queue-names';
import { VehicleMaintenanceProducer } from './vehicle-maintenance.producer';

@Module({})
export class VehicleMaintenanceProducerModule {
  static register(options: { enabled: boolean }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: VehicleMaintenanceAbstractProducer,
        useClass: options.enabled
          ? VehicleMaintenanceProducer
          : class {
              async publish() {}
            },
      },
    ];

    return {
      exports: [VehicleMaintenanceAbstractProducer],
      imports: options.enabled
        ? [BullModule.registerQueue({ name: QueueNames.VehicleMaintenance })]
        : [],
      module: VehicleMaintenanceProducerModule,
      providers,
    };
  }
}
