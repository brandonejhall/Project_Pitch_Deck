import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService, GenerateResponse } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateRequestDto {
  prompt: string;
}

@ApiTags('generate')
@Controller('generate')
export class GenerateController {
  constructor(private aiService: AiService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Commented out for testing
  @ApiOperation({ summary: 'Generate pitch deck slides' })
  @ApiResponse({ status: 200, description: 'Slides generated successfully' })
  async generateSlides(@Body() body: GenerateRequestDto): Promise<GenerateResponse> {
    console.log(`Received generate request with body:`, JSON.stringify(body));
    console.log(`Prompt value: ${body.prompt}`);
    console.log(`Prompt type: ${typeof body.prompt}`);
    console.log(`Prompt length: ${body.prompt ? body.prompt.length : 'undefined'}`);
    
    if (!body.prompt) {
      console.log('Prompt is undefined or empty, using fallback');
      const slides = await this.aiService.generatePitchDeck('Default business idea');
      return { slides };
    }
    
    const slides = await this.aiService.generatePitchDeck(body.prompt);
    console.log(`Generated ${slides.length} slides`);
    return { slides };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test OpenAI API connection' })
  @ApiResponse({ status: 200, description: 'API test completed' })
  async testApi() {
    try {
      const testSlides = await this.aiService.generatePitchDeck('Test business idea');
      return { 
        success: true, 
        message: 'OpenAI API is working',
        slideCount: testSlides.length 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'OpenAI API test failed',
        error: error.message 
      };
    }
  }
} 