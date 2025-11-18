import type { VehicleRepository } from 'src/domain/repositories/vehicle.repository';
import { DeleteVehicleUseCase } from 'src/domain/use-cases/vehicle/delete-vehicle.use-case';

describe('DeleteVehicleUseCase', () => {
  let deleteVehicleUseCase: DeleteVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      save: jest.fn(),
    };
    deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
  });

  it('should delete a vehicle', async () => {
    const vehicleId = '123';
    (vehicleRepository.deleteById as jest.Mock).mockResolvedValue(undefined);

    await deleteVehicleUseCase.execute(vehicleId);

    expect(vehicleRepository.deleteById).toHaveBeenCalledWith(vehicleId);
  });
});
