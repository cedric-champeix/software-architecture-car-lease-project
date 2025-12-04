import { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

import { FindAllClientsUseCase } from '.';

describe('FindAllClientsUseCase', () => {
  let findAllClientsUseCase: FindAllClientsUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    findAllClientsUseCase = new FindAllClientsUseCase(clientRepository);
  });

  it('should return all clients', async () => {
    const clientData = {
      address: '123 Main St',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123456789',
    };

    const clients = [
      new Client({
        ...clientData,
        id: '1',
      }),
      new Client({
        ...clientData,
        id: '2',
      }),
    ];

    (clientRepository.findAll as jest.Mock).mockResolvedValue(clients);

    const result = await findAllClientsUseCase.execute();

    expect(clientRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(clients);
  });
});
