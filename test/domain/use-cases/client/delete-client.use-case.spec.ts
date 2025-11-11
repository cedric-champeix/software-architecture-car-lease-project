import { DeleteClientUseCase } from 'src/domain/use-cases/client/delete-client.use-case';
import { ClientRepository } from 'src/domain/repositories/client.repository';

describe('DeleteClientUseCase', () => {
  let deleteClientUseCase: DeleteClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
