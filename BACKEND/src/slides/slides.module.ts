import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {} 