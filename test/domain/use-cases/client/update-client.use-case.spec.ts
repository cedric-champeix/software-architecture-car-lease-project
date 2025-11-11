import { UpdateClientUseCase } from 'src/domain/use-cases/client/update-client.use-case';
import { ClientRepository } from 'src/domain/repositories/client.repository';
import { Client } from 'src/domain/entities/client.entity';

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    updateClientUseCase = new UpdateClientUseCase(clientRepository);
  });

  it('should update a client', async () => {
    const clientId = '123';
    const clientData = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const client = new Client({
      id: clientId,
      ...clientData,
    });
    (clientRepository.update as jest.Mock).mockResolvedValue(client);

    const result = await updateClientUseCase.execute({
      id: clientId,
      clientData,
    });

    expect(clientRepository.update).toHaveBeenCalledWith({
      id: clientId,
      clientData,
    });
    expect(result).toEqual(client);
  });
});
