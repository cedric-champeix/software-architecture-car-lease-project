import { Client } from 'src/domain/entities/client.entity';
import type { ClientRepository } from 'src/domain/repositories/client.repository';
import { UpdateClientUseCase } from 'src/domain/use-cases/client/update-client.use-case';

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
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
      clientData,
      id: clientId,
    });

    expect(clientRepository.update).toHaveBeenCalledWith({
      clientData,
      id: clientId,
    });
    expect(result).toEqual(client);
  });
});
