import {
  FuelType,
  MotorizationType,
  VehicleStatus,
} from 'src/entities/vehicle/enum';
import { Vehicle } from 'src/entities/vehicle/vehicle.entity';
import type { VehicleRepository } from 'src/repositories/vehicle.repository';

import {
  VEHICLE_FIXTURE,
  VEHICLE_FIXTURE_NO_ID,
} from 'src/test/fixtures/vehicle/vehicle.fixture';
import type { CreateVehicleUseCaseInput } from '.';
import { CreateVehicleUseCase } from '.';
import { CreateVehicle } from 'src/entities/vehicle';

describe('CreateVehicleUseCase', () => {
  let createVehicleUseCase: CreateVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
  });

  it('should create a new vehicle', async () => {
    const vehicleData: CreateVehicleUseCaseInput = {
      acquiredDate: VEHICLE_FIXTURE.acquiredDate,
      color: VEHICLE_FIXTURE.color,
      fuelType: VEHICLE_FIXTURE.fuelType,
      licensePlate: VEHICLE_FIXTURE.licensePlate,
      make: VEHICLE_FIXTURE.make,
      model: VEHICLE_FIXTURE.model,
      motorizationType: VEHICLE_FIXTURE.motorizationType,
    };

    const vehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
    });

    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(null);

    (vehicleRepository.create as jest.Mock).mockResolvedValue(vehicle);

    const result = await createVehicleUseCase.execute(vehicleData);

    expect(vehicleRepository.findByLicensePlate).toHaveBeenCalledWith({
      licensePlate: vehicleData.licensePlate,
    });

    expect(vehicleRepository.create).toHaveBeenCalledWith({
      vehicle: new CreateVehicle({
        ...VEHICLE_FIXTURE_NO_ID,
        status: VehicleStatus.AVAILABLE,
      }),
    });

    expect(result).toEqual(vehicle);
  });

  it('should throw an error if vehicle with this license plate already exists', async () => {
    const vehicleData = {
      acquiredDate: new Date(),
      color: 'blue',
      fuelType: FuelType.PETROL,
      licensePlate: VEHICLE_FIXTURE.licensePlate,
      make: 'Toyota',
      model: 'Corolla',
      motorizationType: MotorizationType.INTERNAL_COMBUSTION,
    };

    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(
      VEHICLE_FIXTURE,
    );

    await expect(createVehicleUseCase.execute(vehicleData)).rejects.toThrow(
      'Vehicle with this license plate already exists.',
    );
  });
});
