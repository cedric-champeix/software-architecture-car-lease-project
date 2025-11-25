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

export enum MotorizationType {
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  HYDROGEN = 'hydrogen',
  INTERNAL_COMBUSTION = 'internal_combustion',
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
