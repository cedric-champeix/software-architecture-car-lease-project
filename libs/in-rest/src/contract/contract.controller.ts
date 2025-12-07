import { CreateContractUseCaseValidator } from '@lib/domain/use-cases/contract/create-contract';
import { DeleteContractUseCase } from '@lib/domain/use-cases/contract/delete-contract';
import { FindAllContractsUseCase } from '@lib/domain/use-cases/contract/find-all-contracts';
import { FindContractUseCase } from '@lib/domain/use-cases/contract/find-contract';
import { UpdateContractUseCase } from '@lib/domain/use-cases/contract/update-contract';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('/api/v1/contracts')
export class ContractController {
  constructor(
    @Inject(CreateContractUseCaseValidator)
    private readonly createContractUseCaseValidator: CreateContractUseCaseValidator,
    @Inject(FindAllContractsUseCase)
    private readonly findAllContractsUseCase: FindAllContractsUseCase,
    @Inject(FindContractUseCase)
    private readonly findContractUseCase: FindContractUseCase,
    @Inject(UpdateContractUseCase)
    private readonly updateContractUseCase: UpdateContractUseCase,
    @Inject(DeleteContractUseCase)
    private readonly deleteContractUseCase: DeleteContractUseCase,
  ) {}

  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.createContractUseCaseValidator.execute(createContractDto);
  }

  @Get()
  findAll() {
    return this.findAllContractsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findContractUseCase.execute({ id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.updateContractUseCase.execute({ id, input: updateContractDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteContractUseCase.execute({ id });
  }
}
