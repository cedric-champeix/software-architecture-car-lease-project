import { CreateVehicleUseCaseValidator } from '@lib/domain/use-cases/vehicle/create-vehicle';
import { DeleteVehicleUseCase } from '@lib/domain/use-cases/vehicle/delete-vehicle';
import { FindAllVehiclesUseCase } from '@lib/domain/use-cases/vehicle/find-all-vehicles';
import { FindVehicleUseCase } from '@lib/domain/use-cases/vehicle/find-vehicle';
import { UpdateVehicleUseCaseValidator } from '@lib/domain/use-cases/vehicle/update-vehicle';
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

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('/api/v1/vehicles')
export class VehicleController {
  constructor(
    @Inject(CreateVehicleUseCaseValidator)
    private readonly createVehicleUseCaseValidator: CreateVehicleUseCaseValidator,
    @Inject(FindAllVehiclesUseCase)
    private readonly findAllVehiclesUseCase: FindAllVehiclesUseCase,
    @Inject(FindVehicleUseCase)
    private readonly findVehicleUseCase: FindVehicleUseCase,
    @Inject(UpdateVehicleUseCaseValidator)
    private readonly updateVehicleUseCaseValidator: UpdateVehicleUseCaseValidator,
    @Inject(DeleteVehicleUseCase)
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.createVehicleUseCaseValidator.execute(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.findAllVehiclesUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findVehicleUseCase.execute({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.updateVehicleUseCaseValidator.execute({
      id,
      input: updateVehicleDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteVehicleUseCase.execute({ id });
  }
}
