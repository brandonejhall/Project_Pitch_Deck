import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { AiService } from '../ai/ai.service';
import { ProjectsService } from '../projects/projects.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FirebaseModule, PrismaModule],
  controllers: [GenerateController],
  providers: [AiService, ProjectsService],
})
export class GenerateModule {} 