import { Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { BackgroundController } from './background.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Background } from './entities/background.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Background])],
  controllers: [BackgroundController],
  providers: [BackgroundService],
})
export class BackgroundModule {}
