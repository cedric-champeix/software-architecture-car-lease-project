import { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';
import { FindAllClientsUseCase } from 'src/domain/use-cases/client/find-all-clients.use-case';

describe('FindAllClientsUseCase', () => {
  let findAllClientsUseCase: FindAllClientsUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    findAllClientsUseCase = new FindAllClientsUseCase(clientRepository);
  });

  it('should return all clients', async () => {
    const clients = [
      new Client({
        address: '123 Main St',
        birthDate: new Date('1990-01-01'),
        driverLicenseNumber: '12345',
        firstName: 'John',
        id: '1',
        lastName: 'Doe',
      }),
    ];
    (clientRepository.findAll as jest.Mock).mockResolvedValue(clients);

    const result = await findAllClientsUseCase.execute();

    expect(clientRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(clients);
  });
});
