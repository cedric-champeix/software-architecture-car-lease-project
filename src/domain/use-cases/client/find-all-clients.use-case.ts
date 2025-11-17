import { Inject, Injectable } from '@nestjs/common';

import { Client } from '../../entities/client.entity';
import type { ClientRepository } from '../../repositories/client.repository';

@Injectable()
export class FindAllClientsUseCase {
  constructor(
    @Inject('ClientRepository')
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
}
