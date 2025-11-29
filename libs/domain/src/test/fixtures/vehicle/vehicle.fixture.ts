import { Vehicle } from '@lib/domain/entities/vehicle';
import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from '@lib/domain/entities/vehicle/enum';

export const VEHICLE_FIXTURE_NO_ID = {
  acquiredDate: new Date(),
  color: 'blue',
  fuelType: FuelType.PETROL,
  licensePlate: 'ABC-123',
  make: 'Toyota',
  model: 'Corolla',
  motorizationType: MotorizationType.ELECTRIC,
  status: VehicleStatus.AVAILABLE,
};

export const VEHICLE_FIXTURE = new Vehicle({
  ...VEHICLE_FIXTURE_NO_ID,
  id: 'vehicle-123',
});
