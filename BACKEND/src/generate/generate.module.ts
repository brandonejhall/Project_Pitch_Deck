import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { AiService } from '../ai/ai.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FirebaseModule, PrismaModule],
  controllers: [GenerateController],
  providers: [AiService],
})
export class GenerateModule {} 