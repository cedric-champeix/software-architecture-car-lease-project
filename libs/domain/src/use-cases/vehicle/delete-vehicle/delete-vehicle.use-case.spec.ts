import type { VehicleRepository } from '@lib/domain/repositories/vehicle.repository';

import type { DeleteVehicleUseCaseInput } from '.';
import { DeleteVehicleUseCase } from '.';

describe('DeleteVehicleUseCase', () => {
  let deleteVehicleUseCase: DeleteVehicleUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(() => {
    vehicleRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByLicensePlate: jest.fn(),
      update: jest.fn(),
    };
    deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
  });

  it('should delete a vehicle', async () => {
    const vehicleId: DeleteVehicleUseCaseInput = { id: '123' };

    (vehicleRepository.deleteById as jest.Mock).mockResolvedValue(true);

    const result = await deleteVehicleUseCase.execute(vehicleId);

    expect(vehicleRepository.deleteById).toHaveBeenCalledWith(vehicleId);

    expect(result).toBe(true);
  });
});
