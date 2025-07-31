import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { AiService } from '../ai/ai.service';

@Module({
  controllers: [GenerateController],
  providers: [AiService],
})
export class GenerateModule {} 