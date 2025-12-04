import { Client } from '@lib/domain/entities/client/client.entity';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

import { UpdateClientUseCase } from '.';

const clientMock = new Client({
  address: '123 Main St',
  birthDate: new Date('1990-01-01'),
  driverLicenseNumber: '12345',
  email: 'jhon.doe@email.com',
  firstName: 'John',
  id: 'client-1',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
});

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    updateClientUseCase = new UpdateClientUseCase(clientRepository);
  });

  it('should update a client', async () => {
    const id = clientMock.id;
    const clientData = {
      address: '123 Main St',
      driverLicenseNumber: '123456789',
      email: 'new.email@email.com',
      phoneNumber: '+1234567890',
    };

    const client = new Client({
      ...clientMock,
      ...clientData,
    });

    (clientRepository.update as jest.Mock).mockResolvedValue(client);

    const result = await updateClientUseCase.execute({
      clientData,
      id,
    });

    expect(clientRepository.update).toHaveBeenCalledWith({
      clientData,
      id,
    });

    expect(result).toEqual(client);
  });
});
