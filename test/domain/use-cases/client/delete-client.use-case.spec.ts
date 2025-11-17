import type { ClientRepository } from 'src/domain/repositories/client.repository';
import { DeleteClientUseCase } from 'src/domain/use-cases/client/delete-client.use-case';

describe('DeleteClientUseCase', () => {
  let deleteClientUseCase: DeleteClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    deleteClientUseCase = new DeleteClientUseCase(clientRepository);
  });

  it('should delete a client', async () => {
    const clientId = '123';
    (clientRepository.delete as jest.Mock).mockResolvedValue(true);

    await deleteClientUseCase.execute({ id: clientId });

    expect(clientRepository.delete).toHaveBeenCalledWith({ id: clientId });
  });
});
