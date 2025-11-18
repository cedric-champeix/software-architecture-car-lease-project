export class Vehicle {
  id: string;
  make: string;
  model: string;
  fuelType: FuelType;
  color: string;
  licensePlate: string;
  acquiredDate: Date;
  status: VehicleStatus;

  constructor(init?: Partial<Vehicle>) {
    Object.assign(this, init);
  }
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  LEASED = 'leased',
  MAINTENANCE = 'maintenance',
}

export enum FuelType {
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  PETROL = 'petrol',
}
