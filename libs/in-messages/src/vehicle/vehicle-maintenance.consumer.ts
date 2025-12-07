import { CancelContractsForVehicleInMaintenanceUseCase } from '@lib/domain/use-cases/contract/cancel-contracts-for-vehicle-in-maintenance';
import { QueueNames } from '@lib/out-messages/enum/queue-names';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

interface VehicleMaintenanceJobData {
  vehicleId: string;
}

@Processor(QueueNames.VehicleMaintenance)
export class VehicleMaintenanceConsumer extends WorkerHost {
  constructor(
    private readonly cancelContractsForVehicleInMaintenanceUseCase: CancelContractsForVehicleInMaintenanceUseCase,
  ) {
    super();
  }

  async process(
    job: Job<VehicleMaintenanceJobData, any, string>,
  ): Promise<any> {
    const { vehicleId } = job.data;

    await this.cancelContractsForVehicleInMaintenanceUseCase.execute(vehicleId);

    return;
  }
}
