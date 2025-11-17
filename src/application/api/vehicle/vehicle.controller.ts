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
import { CreateVehicleDto } from 'src/application/api/vehicle/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/application/api/vehicle/dto/update-vehicle.dto';
import { CreateVehicleUseCase } from 'src/domain/use-cases/vehicle/create-vehicle.use-case';
import { DeleteVehicleUseCase } from 'src/domain/use-cases/vehicle/delete-vehicle.use-case';
import { FindAllVehiclesUseCase } from 'src/domain/use-cases/vehicle/find-all-vehicles.use-case';
import { FindVehicleUseCase } from 'src/domain/use-cases/vehicle/find-vehicle.use-case';
import { UpdateVehicleUseCase } from 'src/domain/use-cases/vehicle/update-vehicle.use-case';

@Controller('vehicles')
export class VehicleController {
  constructor(
    @Inject(CreateVehicleUseCase)
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    @Inject(FindAllVehiclesUseCase)
    private readonly findAllVehiclesUseCase: FindAllVehiclesUseCase,
    @Inject(FindVehicleUseCase)
    private readonly findVehicleUseCase: FindVehicleUseCase,
    @Inject(UpdateVehicleUseCase)
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    @Inject(DeleteVehicleUseCase)
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.createVehicleUseCase.execute(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.findAllVehiclesUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findVehicleUseCase.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.updateVehicleUseCase.execute(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteVehicleUseCase.execute(id);
  }
}
