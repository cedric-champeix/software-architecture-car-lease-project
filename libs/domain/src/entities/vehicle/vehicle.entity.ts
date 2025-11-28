import type { FuelType, MotorizationType, VehicleStatus } from './enum';

export class Vehicle {
  id: string;
  make: string;
  model: string;
  fuelType: FuelType;
  motorizationType: MotorizationType;
  color: string;
  licensePlate: string;
  acquiredDate: Date;
  status: VehicleStatus;

  constructor(init: Vehicle) {
    Object.assign(this, init);
  }
}
