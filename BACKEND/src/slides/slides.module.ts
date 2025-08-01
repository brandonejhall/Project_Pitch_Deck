import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {} 