import { DeleteVehicleUseCase } from 'src/domain/use-cases/vehicle/delete-vehicle.use-case';
import { VehicleRepository } from 'src/domain/repositories/vehicle.repository';

describe('DeleteVehicleUseCase', () => {
  let deleteVehicleUseCase: DeleteVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      deleteById: jest.fn(),
      findByLicensePlate: jest.fn(),
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
