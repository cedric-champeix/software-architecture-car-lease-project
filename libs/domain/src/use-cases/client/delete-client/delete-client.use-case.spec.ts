import type { ClientRepository } from 'src/repositories/client.repository';

import { DeleteClientUseCase } from '.';

describe('DeleteClientUseCase', () => {
  let deleteClientUseCase: DeleteClientUseCase;
  let clientRepository: ClientRepository;

  beforeEach(() => {
    clientRepository = {
      create: jest.fn(),
      deleteById: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };
    deleteClientUseCase = new DeleteClientUseCase(clientRepository);
  });

  it('should delete a client', async () => {
    const clientId = '123';

    (clientRepository.deleteById as jest.Mock).mockResolvedValue(true);

    await deleteClientUseCase.execute({ id: clientId });

    expect(clientRepository.deleteById).toHaveBeenCalledWith({ id: clientId });
  });
});
