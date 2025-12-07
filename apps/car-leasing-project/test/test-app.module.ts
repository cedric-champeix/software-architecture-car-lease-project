import { InCronModule } from '@lib/in-cron';
import { InMessagesModule } from '@lib/in-messages';
import { InRestModule } from '@lib/in-rest';
import { OutMessagesModule } from '@lib/out-messages';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { HealthModule } from '../src/health/health.module';

/**
 * Test-specific AppModule that allows overriding the MongoDB URI
 * This ensures the consumer and test use the same database connection
 */
@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true, // Don't load .env files, use process.env directly
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/car-lease-test',
    ),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
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
export class TestAppModule {}
