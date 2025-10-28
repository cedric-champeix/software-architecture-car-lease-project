import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateClientUseCase } from 'src/domain/use-cases/client/create-client.use-case';
import { DeleteClientUseCase } from 'src/domain/use-cases/client/delete-client.use-case';
import { FindAllClientsUseCase } from 'src/domain/use-cases/client/find-all-clients.use-case';
import { FindClientUseCase } from 'src/domain/use-cases/client/find-client.use-case';
import { UpdateClientUseCase } from 'src/domain/use-cases/client/update-client.use-case';

import { CreateClientDtoMapper } from './adapter/create-client.mapper';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('api/v1/clients')
export class ClientController {
  constructor(
    private readonly findClientUseCase: FindClientUseCase,
    private readonly findAllClientsUseCase: FindAllClientsUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto) {
    const client = await this.createClientUseCase.execute(
      CreateClientDtoMapper.toUseCaseInput(createClientDto),
    );

    return { message: 'Client created', data: client };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const clients = await this.findAllClientsUseCase.execute();

    return { data: clients };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const client = await this.findClientUseCase.execute({ id });

    if (!client) throw new NotFoundException('Client not found');

    return { data: client };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const client = await this.updateClientUseCase.execute({
      id,
      clientData: UpdateClientDtoMapper.toUseCaseInput(updateClientDto),
    });

    if (!client) throw new NotFoundException('Client not found');

    return { message: 'Client updated', data: client };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    const result = this.clientService.remove(id);

    if (!result) throw new NotFoundException('Client not found');
  }
}
