import { Module } from '@nestjs/common';

import { OutMongooseService } from './out-mongoose.service';

@Module({
  exports: [OutMongooseService],
  providers: [OutMongooseService],
})
export class OutMongooseModule {}
