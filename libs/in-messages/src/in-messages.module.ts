import { Module } from '@nestjs/common';

import { InMessagesService } from './in-messages.service';

@Module({
  exports: [InMessagesService],
  providers: [InMessagesService],
})
export class InMessagesModule {}
