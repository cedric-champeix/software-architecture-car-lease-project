import type { FuelType, MotorizationType, VehicleStatus } from './enum';

export class UpdateVehicle {
  make?: string;
  model?: string;
  fuelType?: FuelType;
  motorizationType?: MotorizationType;
  color?: string;
  licensePlate?: string;
  acquiredDate?: Date;
  status?: VehicleStatus;

  constructor(init: Partial<UpdateVehicle>) {
    Object.assign(this, init);
  }
}
