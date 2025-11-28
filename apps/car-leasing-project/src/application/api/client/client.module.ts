import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from 'src/application/api/client/client.controller';
import { CreateClientUseCase } from '@lib/domain/src/use-cases/client/create-client.use-case';
import { DeleteClientUseCase } from '@lib/domain/src/use-cases/client/delete-client.use-case';
import { FindAllClientsUseCase } from '@lib/domain/src/use-cases/client/find-all-clients.use-case';
import { FindClientUseCase } from '@lib/domain/src/use-cases/client/find-client.use-case';
import { UpdateClientUseCase } from '@lib/domain/src/use-cases/client/update-client.use-case';
import { ClientMongooseRepository } from 'src/infrastructure/persistence/mongoose/repositories/client.mongoose.repository';
import {
  ClientModel,
  ClientSchema,
} from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

@Module({
  controllers: [ClientController],
  exports: [
    CreateClientUseCase,
    FindClientUseCase,
    FindAllClientsUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    {
      provide: 'ClientRepository',
      useClass: ClientMongooseRepository,
    },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ClientModel.name, schema: ClientSchema },
    ]),
  ],
  providers: [
    CreateClientUseCase,
    FindClientUseCase,
    FindAllClientsUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    {
      provide: 'ClientRepository',
      useClass: ClientMongooseRepository,
    },
  ],
})
export class ClientModule {}
