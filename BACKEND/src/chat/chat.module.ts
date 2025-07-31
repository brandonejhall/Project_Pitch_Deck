import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AiService } from '../ai/ai.service';

@Module({
  controllers: [ChatController],
  providers: [AiService],
})
export class ChatModule {} 