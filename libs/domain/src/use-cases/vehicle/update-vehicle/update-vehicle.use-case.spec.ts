import { VehicleStatus } from '../../../entities/vehicle/enum';
import { Vehicle } from '../../../entities/vehicle/vehicle.entity';
import type { VehicleMaintenanceProducer } from '../../../producers/vehicle-maintenance.producer';
import type { VehicleRepository } from '../../../repositories/vehicle.repository';
import { VEHICLE_FIXTURE } from '../../../test/fixtures/vehicle/vehicle.fixture';
import { UpdateVehicleUseCase } from '../../../use-cases/vehicle/update-vehicle';

describe('UpdateVehicleUseCase', () => {
  let updateVehicleUseCase: UpdateVehicleUseCase;
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

    updateVehicleUseCase = new UpdateVehicleUseCase(
      vehicleRepository,
      vehicleMaintenanceProducer,
    );
  });

  it('should update a vehicle', async () => {
    const vehicleId = { id: '123' };

    const vehicleData = {
      color: 'red',
      model: 'Camry',
    };

    const updatedVehicle = new Vehicle({ ...VEHICLE_FIXTURE, ...vehicleData });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(
      VEHICLE_FIXTURE,
    );
    (vehicleRepository.update as jest.Mock).mockResolvedValue(updatedVehicle);

    const result = await updateVehicleUseCase.execute({
      id: vehicleId.id,
      input: vehicleData,
    });

    expect(vehicleRepository.findById).toHaveBeenCalledWith(vehicleId);

    expect(vehicleRepository.update).toHaveBeenCalledWith({
      id: vehicleId.id,
      vehicle: { ...VEHICLE_FIXTURE, ...vehicleData },
    });

    expect(result).toEqual(updatedVehicle);
  });

  it('should send vehicle maintenance job if vehicle status is maintenance', async () => {
    const vehicleId = { id: '123' };
    const vehicleData = {
      status: VehicleStatus.MAINTENANCE,
    };
    const vehicle = new Vehicle({
      ...VEHICLE_FIXTURE,
      id: vehicleId.id,
      status: VehicleStatus.AVAILABLE,
    });

    (vehicleRepository.findById as jest.Mock).mockResolvedValue(vehicle);
    (vehicleRepository.update as jest.Mock).mockResolvedValue(vehicle);

    await updateVehicleUseCase.execute({
      id: vehicleId.id,
      input: vehicleData,
    });

    expect(
      vehicleMaintenanceProducer.sendVehicleMaintenanceJob,
    ).toHaveBeenCalledWith(vehicleId.id);
  });
});
