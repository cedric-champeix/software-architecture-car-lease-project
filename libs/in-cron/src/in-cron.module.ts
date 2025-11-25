import { Module } from '@nestjs/common';

import { InCronService } from './in-cron.service';

@Module({
  exports: [InCronService],
  providers: [InCronService],
})
export class InCronModule {}
