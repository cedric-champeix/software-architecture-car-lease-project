import { Module } from '@nestjs/common';

import { OutMessagesService } from './out-messages.service';

@Module({
  exports: [OutMessagesService],
  providers: [OutMessagesService],
})
export class OutMessagesModule {}
