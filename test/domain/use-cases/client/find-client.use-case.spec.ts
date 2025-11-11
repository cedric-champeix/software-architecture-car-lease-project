import { FindClientUseCase } from 'src/domain/use-cases/client/find-client.use-case';
import { ClientRepository } from 'src/domain/repositories/client.repository';
import { Client } from 'src/domain/entities/client.entity';

describe('FindClientUseCase', () => {
  let findClientUseCase: FindClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    findClientUseCase = new FindClientUseCase(clientRepository);
  });

  it('should return a client by id', async () => {
    const clientId = '123';
    const client = new Client({
      id: clientId,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01'),
      driverLicenseNumber: '12345',
      address: '123 Main St',
    });
    (clientRepository.findById as jest.Mock).mockResolvedValue(client);

    const result = await findClientUseCase.execute({ id: clientId });

    expect(clientRepository.findById).toHaveBeenCalledWith({ id: clientId });
    expect(result).toEqual(client);
  });
});
