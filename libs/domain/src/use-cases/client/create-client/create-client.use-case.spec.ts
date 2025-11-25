import { Client } from 'src/entities/client.entity';
import type { ClientRepository } from 'src/repositories/client.repository';

import { CreateClientUseCase } from '.';

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      delete: jest.fn(),
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
    };
    const client = new Client(clientData);
    (clientRepository.create as jest.Mock).mockResolvedValue(client);

    const {
      email,
      firstName,
      lastName,
      address,
      birthDate,
      driverLicenseNumber,
    } = clientData;

    const result = await createClientUseCase.execute({
      address,
      birthDate,
      driverLicenseNumber,
      email,
      firstName,
      lastName,
    });

    expect(clientRepository.create).toHaveBeenCalledWith({
      client: {
        address,
        birthDate,
        driverLicenseNumber,
        email,
        firstName,
        id: '',
        lastName,
      },
    });
    expect(result).toEqual(client);
  });
});
