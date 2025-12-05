import { VehicleMaintenanceProducer as VehicleMaintenanceAbstractProducer } from '@lib/domain/producers/vehicle-maintenance.producer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { JobNames } from '../../enum/job-names';
import { QueueNames } from '../../enum/queue-names';

@Injectable()
export class VehicleMaintenanceProducer extends VehicleMaintenanceAbstractProducer {
  constructor(
    @InjectQueue(QueueNames.VehicleMaintenance)
    private readonly vehicleMaintenanceQueue: Queue,
  ) {
    super();
  }

  async sendVehicleMaintenanceJob(vehicleId: string) {
    await this.vehicleMaintenanceQueue.add(JobNames.HandleVehicleMaintenance, {
      vehicleId,
    });
  }
}
