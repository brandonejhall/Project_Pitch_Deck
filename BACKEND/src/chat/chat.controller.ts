import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService, ChatResponse } from '../ai/ai.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

export class ChatRequestDto {
  prompt: string;
  slide_id: number;
  slideData?: {
    id: string;
    title: string;
    content: string;
    heroImageUrl?: string;
    layout?: string;
  };
}

// In-memory chat context storage (in production, use Redis or database)
const chatContext: Record<number, string> = {};

@ApiTags('chat')
@Controller('chat')
@UseGuards(FirebaseAuthGuard) // Enable Firebase auth
export class ChatController {
  constructor(private aiService: AiService) {}

  @Post()
  @ApiOperation({ summary: 'Get slide editing suggestions' })
  @ApiResponse({ status: 200, description: 'Chat response generated' })
  async chatRequest(@Body() body: ChatRequestDto): Promise<ChatResponse> {
    const context = chatContext[body.slide_id] || "";
    const response = await this.aiService.chatEdit(body.prompt, context, body.slideData);
    
    // Update context for future requests
    chatContext[body.slide_id] = response.context;
    
    return response;
  }
} 