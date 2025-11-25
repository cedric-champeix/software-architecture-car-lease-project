import { Module } from '@nestjs/common';

import { InRestService } from './in-rest.service';

@Module({
  exports: [InRestService],
  providers: [InRestService],
})
export class InRestModule {}
