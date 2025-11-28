import { Client } from 'src/entities/client/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

import { CreateClientUseCase } from '.';

const clientMock = new Client({
  id: '1',
  address: '123 Main St',
  birthDate: new Date('1990-01-01'),
  driverLicenseNumber: '12345',
  email: 'jhon.doe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
});

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    createClientUseCase = new CreateClientUseCase(clientRepository);
  });

  it('should create a new client', async () => {
    const clientData = {
      address: '123 Main St',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      email: 'jhon.doe@email.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
    };

    const client = new Client({ ...clientData, id: '1' });

    (clientRepository.create as jest.Mock).mockResolvedValue(client);

    const result = await createClientUseCase.execute({
      ...clientData,
    });

    expect(clientRepository.create).toHaveBeenCalledWith({
      client: {
        ...clientData,
      },
    });

    expect(result).toEqual(client);
  });
});
