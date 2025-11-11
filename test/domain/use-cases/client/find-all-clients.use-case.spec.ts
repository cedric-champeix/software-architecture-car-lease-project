import { FindAllClientsUseCase } from 'src/domain/use-cases/client/find-all-clients.use-case';
import { ClientRepository } from 'src/domain/repositories/client.repository';
import { Client } from 'src/domain/entities/client.entity';

describe('FindAllClientsUseCase', () => {
  let findAllClientsUseCase: FindAllClientsUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    findAllClientsUseCase = new FindAllClientsUseCase(clientRepository);
  });

  it('should return all clients', async () => {
    const clients = [
      new Client({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('1990-01-01'),
        driverLicenseNumber: '12345',
        address: '123 Main St',
      }),
    ];
    (clientRepository.findAll as jest.Mock).mockResolvedValue(clients);

    const result = await findAllClientsUseCase.execute();

    expect(clientRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(clients);
  });
});
