import configuration from '@lib/common/config/configuration';
import { InCronModule } from '@lib/in-cron';
import { InMessagesModule } from '@lib/in-messages';
import { InRestModule } from '@lib/in-rest';
import { OutMessagesModule } from '@lib/out-messages';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
        },
      }),
    }),
    InRestModule,
    InCronModule,
    InMessagesModule.register({
      enableConsumers: process.env.DISABLE_CONSUMERS !== 'true',
    }),
    OutMessagesModule.register({
      enableProducers: process.env.DISABLE_CONSUMERS !== 'true',
    }),
    HealthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
