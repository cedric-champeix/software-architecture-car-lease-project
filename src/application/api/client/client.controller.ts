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
import { UpdateClientDtoMapper } from './adapter/update-client.mapper';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
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

    return client;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const clients = await this.findAllClientsUseCase.execute();

    return clients;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const client = await this.findClientUseCase.execute({ id });

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const client = await this.updateClientUseCase.execute({
      clientData: UpdateClientDtoMapper.toUseCaseInput(updateClientDto),
      id,
    });

    if (!client) throw new NotFoundException('Client not found');

    return client;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.deleteClientUseCase.execute({ id });

    if (!result) throw new NotFoundException('Client not found');
  }
}
