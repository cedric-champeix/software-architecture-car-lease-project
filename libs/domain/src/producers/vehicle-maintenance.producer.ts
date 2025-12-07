export abstract class VehicleMaintenanceProducer {
  abstract sendVehicleMaintenanceJob(vehicleId: string): Promise<void>;
}
