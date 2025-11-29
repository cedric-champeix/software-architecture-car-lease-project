import { InCronModule } from '@lib/in-cron';
import { InRestModule } from '@lib/in-rest';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/car-lease'),
    InRestModule,
    InCronModule,
  ],
  providers: [AppService],
})
export class AppModule {}
