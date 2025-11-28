import { Vehicle } from 'src/entities/vehicle';
import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from 'src/entities/vehicle/enum';

export const VEHICLE_FIXTURE_NO_ID = {
  licensePlate: 'ABC-123',
  make: 'Toyota',
  model: 'Corolla',
  fuelType: FuelType.PETROL,
  motorizationType: MotorizationType.ELECTRIC,
  status: VehicleStatus.AVAILABLE,
  acquiredDate: new Date(),
  color: 'blue',
};

export const VEHICLE_FIXTURE = new Vehicle({
  ...VEHICLE_FIXTURE_NO_ID,
  id: 'vehicle-123',
});
