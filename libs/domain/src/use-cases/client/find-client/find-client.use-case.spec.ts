import { Client } from 'src/entities/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

import { FindClientUseCase } from '.';

describe('FindClientUseCase', () => {
  let findClientUseCase: FindClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    findClientUseCase = new FindClientUseCase(clientRepository);
  });

  it('should return a client by id', async () => {
    const clientId = '123';
    const client = new Client({
      address: '123 Main St',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      firstName: 'John',
      id: clientId,
      lastName: 'Doe',
    });
    (clientRepository.findById as jest.Mock).mockResolvedValue(client);

    const result = await findClientUseCase.execute({ id: clientId });

    expect(clientRepository.findById).toHaveBeenCalledWith(clientId);
    expect(result).toEqual(client);
  });
});
