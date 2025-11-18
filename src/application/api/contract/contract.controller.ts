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
import { CreateContractDto } from 'src/application/api/contract/dto/create-contract.dto';
import { UpdateContractDto } from 'src/application/api/contract/dto/update-contract.dto';
import { CreateContractUseCase } from 'src/domain/use-cases/contract/create-contract.use-case';
import { DeleteContractUseCase } from 'src/domain/use-cases/contract/delete-contract.use-case';
import { FindAllContractsUseCase } from 'src/domain/use-cases/contract/find-all-contracts.use-case';
import { FindContractUseCase } from 'src/domain/use-cases/contract/find-contract.use-case';
import { UpdateContractUseCase } from 'src/domain/use-cases/contract/update-contract.use-case';

@Controller('contracts')
export class ContractController {
  constructor(
    @Inject(CreateContractUseCase)
    private readonly createContractUseCase: CreateContractUseCase,
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
    return this.createContractUseCase.execute(createContractDto);
  }

  @Get()
  findAll() {
    return this.findAllContractsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findContractUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.updateContractUseCase.execute(id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteContractUseCase.execute(id);
  }
}
