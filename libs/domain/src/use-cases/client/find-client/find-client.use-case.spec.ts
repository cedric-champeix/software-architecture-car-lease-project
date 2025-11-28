import { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

import { FindClientUseCase } from '.';

describe('FindClientUseCase', () => {
  let findClientUseCase: FindClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
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
      email: 'john.doe@example.com',
      firstName: 'John',
      id: clientId,
      lastName: 'Doe',
      phoneNumber: '123456789',
    });
    (clientRepository.findById as jest.Mock).mockResolvedValue(client);

    const result = await findClientUseCase.execute({ id: clientId });

    expect(clientRepository.findById).toHaveBeenCalledWith({ id: clientId });
    expect(result).toEqual(client);
  });
});
