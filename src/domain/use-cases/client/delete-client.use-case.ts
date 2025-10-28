import type { ClientRepository } from 'src/domain/repositories/client.repository';

export type DeleteClientUseCaseInput = {
  id: string;
};

export class DeleteClientUseCase {
  constructor(private readonly repository: ClientRepository) {}

  async execute({ id }: DeleteClientUseCaseInput): Promise<boolean> {
    return await this.repository.delete({ id });
  }
}
