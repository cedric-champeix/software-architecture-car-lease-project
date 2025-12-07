import { VehicleStatus } from '@lib/domain/entities/vehicle/enum';
import { Vehicle } from '@lib/domain/entities/vehicle/vehicle.entity';
import type { VehicleMaintenanceProducer } from '@lib/domain/producers/vehicle-maintenance.producer';
import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';
import { VEHICLE_FIXTURE } from '@lib/domain/test/fixtures/vehicle/vehicle.fixture';

import type { UpdateVehicleUseCaseInput } from '.';
import { UpdateVehicleUseCaseValidator } from '.';

describe('UpdateVehicleUseCaseValidator', () => {
  let updateVehicleUseCaseValidator: UpdateVehicleUseCaseValidator;
  let vehicleRepository: VehicleRepository;
  let vehicleMaintenanceProducer: VehicleMaintenanceProducer;

  beforeEach(() => {
    vehicleRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      update: jest.fn(),
    };

    vehicleMaintenanceProducer = {
      sendVehicleMaintenanceJob: jest.fn(),
    } as VehicleMaintenanceProducer;

    updateVehicleUseCaseValidator = new UpdateVehicleUseCaseValidator(
      vehicleRepository,
      vehicleMaintenanceProducer,
    );
  });

  it('should throw an error if vehicle does not exist', async () => {
    const input: UpdateVehicleUseCaseInput = {
      id: 'non-existent-id',
      input: {
        color: 'red',
      },
    };

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateVehicleUseCaseValidator.execute(input)).rejects.toThrow(
      'Vehicle not found.',
    );
  });

  it('should throw an error if license plate already exists on another vehicle', async () => {
    const existingVehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      id: '123',
      licensePlate: 'ABC-123',
    });

    const anotherVehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      id: '456',
      licensePlate: 'XYZ-789',
    });

    const input: UpdateVehicleUseCaseInput = {
      id: '123',
      input: {
        licensePlate: 'XYZ-789', // Trying to use another vehicle's license plate
      },
    };

    // First call for VehicleExistsValidator
    (vehicleRepository.findById as jest.Mock).mockResolvedValueOnce(
      existingVehicle,
    );
    // Second call for UniqueLicensePlateOnUpdateValidator
    (vehicleRepository.findById as jest.Mock).mockResolvedValueOnce(
      existingVehicle,
    );
    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(
      anotherVehicle,
    );

    await expect(updateVehicleUseCaseValidator.execute(input)).rejects.toThrow(
      'A vehicle with license plate "XYZ-789" already exists',
    );
  });

  it('should not throw an error if license plate is not changing', async () => {
    const existingVehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      id: '123',
      licensePlate: 'ABC-123',
    });

    const input: UpdateVehicleUseCaseInput = {
      id: '123',
      input: {
        color: 'red',
        licensePlate: 'ABC-123', // Same license plate
      },
    };

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(
      existingVehicle,
    );
    (vehicleRepository.update as jest.Mock).mockResolvedValue(existingVehicle);

    await expect(
      updateVehicleUseCaseValidator.execute(input),
    ).resolves.not.toThrow();
  });

  it('should successfully update when license plate is changed to a unique value', async () => {
    const existingVehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      id: '123',
      licensePlate: 'ABC-123',
      status: VehicleStatus.AVAILABLE,
    });

    const input: UpdateVehicleUseCaseInput = {
      id: '123',
      input: {
        licensePlate: 'NEW-456',
      },
    };

    // First call for VehicleExistsValidator
    (vehicleRepository.findById as jest.Mock).mockResolvedValueOnce(
      existingVehicle,
    );
    // Second call for UniqueLicensePlateOnUpdateValidator
    (vehicleRepository.findById as jest.Mock).mockResolvedValueOnce(
      existingVehicle,
    );
    // Third call in the actual execute method
    (vehicleRepository.findById as jest.Mock).mockResolvedValueOnce(
      existingVehicle,
    );
    (vehicleRepository.findByLicensePlate as jest.Mock).mockResolvedValue(null);
    (vehicleRepository.update as jest.Mock).mockResolvedValue(existingVehicle);

    const result = await updateVehicleUseCaseValidator.execute(input);

    expect(result).toBeDefined();
    expect(vehicleRepository.update).toHaveBeenCalled();
  });
});
