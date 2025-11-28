import { UseCase } from '@lib/domain/common/use-cases';
import type { ClientRepository } from '@lib/domain/repositories/client.repository';

export type DeleteClientUseCaseInput = {
  id: string;
};

export class DeleteClientUseCase extends UseCase<
  DeleteClientUseCaseInput,
  boolean
> {
  constructor(private readonly repository: ClientRepository) {
    super();
  }

  async execute({ id }: DeleteClientUseCaseInput): Promise<boolean> {
    return await this.repository.deleteById({ id });
  }
}
