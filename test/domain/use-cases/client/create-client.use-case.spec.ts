import { CreateClientUseCase } from 'src/domain/use-cases/client/create-client.use-case';
import { ClientRepository } from 'src/domain/repositories/client.repository';
import { Client } from 'src/domain/entities/client.entity';

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    createClientUseCase = new CreateClientUseCase(clientRepository);
  });

  it('should create a new client', async () => {
    const clientData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'jhon.doe@email.com',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      address: '123 Main St',
    };
    const client = new Client(clientData);
    (clientRepository.create as jest.Mock).mockResolvedValue(client);

    const { email, firstName, lastName } = clientData;

    const result = await createClientUseCase.execute({
      email,
      firstName,
      lastName,
    });

    expect(clientRepository.create).toHaveBeenCalledWith({
      client: {
        id: '',
        email,
        firstName,
        lastName,
      },
    });
    expect(result).toEqual(client);
  });
});
