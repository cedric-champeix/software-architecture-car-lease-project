import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from 'src/application/api/client/client.controller';
import { CreateClientUseCase } from 'src/domain/use-cases/client/create-client.use-case';
import { DeleteClientUseCase } from 'src/domain/use-cases/client/delete-client.use-case';
import { FindAllClientsUseCase } from 'src/domain/use-cases/client/find-all-clients.use-case';
import { FindClientUseCase } from 'src/domain/use-cases/client/find-client.use-case';
import { UpdateClientUseCase } from 'src/domain/use-cases/client/update-client.use-case';
import { ClientMongooseRepository } from 'src/infrastructure/persistence/mongoose/repositories/client.mongoose.repository';
import {
  ClientModel,
  ClientSchema,
} from 'src/infrastructure/persistence/mongoose/schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClientModel.name, schema: ClientSchema },
    ]),
  ],
  controllers: [ClientController],
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
  exports: [
    {
      provide: 'ClientRepository',
      useClass: ClientMongooseRepository,
    },
  ],
})
export class ClientModule {}
