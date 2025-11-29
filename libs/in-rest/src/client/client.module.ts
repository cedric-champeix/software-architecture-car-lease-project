import { CreateClientUseCase } from '@lib/domain/use-cases/client/create-client';
import { DeleteClientUseCase } from '@lib/domain/use-cases/client/delete-client';
import { FindAllClientsUseCase } from '@lib/domain/use-cases/client/find-all-clients';
import { FindClientUseCase } from '@lib/domain/use-cases/client/find-client';
import { UpdateClientUseCase } from '@lib/domain/use-cases/client/update-client';
import { OutMongooseModule } from '@lib/out-mongoose/out-mongoose.module';
import { ClientMongooseRepository } from '@lib/out-mongoose/repositories/client.mongoose.repository';
import { Module } from '@nestjs/common';

import { ClientController } from './client.controller';

@Module({
  controllers: [ClientController],
  exports: [
    CreateClientUseCase,
    FindClientUseCase,
    FindAllClientsUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
  ],
  imports: [OutMongooseModule],
  providers: [
    {
      inject: [ClientMongooseRepository],
      provide: CreateClientUseCase,
      useFactory: (clientRepository: ClientMongooseRepository) => {
        return new CreateClientUseCase(clientRepository);
      },
    },
    {
      inject: [ClientMongooseRepository],
      provide: FindClientUseCase,
      useFactory: (clientRepository: ClientMongooseRepository) => {
        return new FindClientUseCase(clientRepository);
      },
    },
    {
      inject: [ClientMongooseRepository],
      provide: FindAllClientsUseCase,
      useFactory: (clientRepository: ClientMongooseRepository) => {
        return new FindAllClientsUseCase(clientRepository);
      },
    },
    {
      inject: [ClientMongooseRepository],
      provide: UpdateClientUseCase,
      useFactory: (clientRepository: ClientMongooseRepository) => {
        return new UpdateClientUseCase(clientRepository);
      },
    },
    {
      inject: [ClientMongooseRepository],
      provide: DeleteClientUseCase,
      useFactory: (clientRepository: ClientMongooseRepository) => {
        return new DeleteClientUseCase(clientRepository);
      },
    },
  ],
})
export class ClientModule {}
