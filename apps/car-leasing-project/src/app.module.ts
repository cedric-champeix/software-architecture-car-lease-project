import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './application/api/client/client.module';
import { ContractModule } from './application/api/contract/contract.module';
import { VehicleModule } from './application/api/vehicle/vehicle.module';
import { TasksService } from './application/tasks/tasks.service';

@Module({
  controllers: [AppController],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/car-lease'),
    ClientModule,
    VehicleModule,
    ContractModule,
  ],
  providers: [AppService, TasksService],
})
export class AppModule {}
