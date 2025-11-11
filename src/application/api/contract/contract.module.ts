import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractController } from './contract.controller';
import { CreateContractUseCase } from 'src/domain/use-cases/contract/create-contract.use-case';
import { FindAllContractsUseCase } from 'src/domain/use-cases/contract/find-all-contracts.use-case';
import { FindContractUseCase } from 'src/domain/use-cases/contract/find-contract.use-case';
import { UpdateContractUseCase } from 'src/domain/use-cases/contract/update-contract.use-case';
import { DeleteContractUseCase } from 'src/domain/use-cases/contract/delete-contract.use-case';
import { ContractMongooseRepository } from 'src/infrastructure/persistence/mongoose/repositories/contract.mongoose.repository';
import {
  ContractModel,
  ContractSchema,
} from 'src/infrastructure/persistence/mongoose/schemas/contract.schema';
import { ClientModule } from '../client/client.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ContractService } from 'src/domain/services/contract.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContractModel.name, schema: ContractSchema },
    ]),
    ClientModule,
    forwardRef(() => VehicleModule),
  ],
  controllers: [ContractController],
  providers: [
    CreateContractUseCase,
    FindAllContractsUseCase,
    FindContractUseCase,
    UpdateContractUseCase,
    DeleteContractUseCase,
    ContractService,
    {
      provide: 'ContractRepository',
      useClass: ContractMongooseRepository,
    },
  ],
  exports: [ContractService],
})
export class ContractModule {}
