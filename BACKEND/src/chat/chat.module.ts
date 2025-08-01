import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AiService } from '../ai/ai.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [FirebaseModule, PrismaModule],
  controllers: [ChatController],
  providers: [AiService],
})
export class ChatModule {} 