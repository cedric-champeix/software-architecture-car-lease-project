import { InCronModule } from '@lib/in-cron';
import { InMessagesModule } from '@lib/in-messages';
import { InRestModule } from '@lib/in-rest';
import { OutMessagesModule } from '@lib/out-messages';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  controllers: [AppController],
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/car-lease'),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    InRestModule,
    InCronModule,
    InMessagesModule,
    OutMessagesModule,
    HealthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
