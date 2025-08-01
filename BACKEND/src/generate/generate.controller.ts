import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService, GenerateResponse } from '../ai/ai.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ProjectsService } from '../projects/projects.service';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateRequestDto {
  prompt: string;
}

@ApiTags('generate')
@Controller('generate')
export class GenerateController {
  constructor(
    private aiService: AiService,
    private projectsService: ProjectsService
  ) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Generate pitch deck slides' })
  @ApiResponse({ status: 200, description: 'Slides generated successfully' })
  async generateSlides(@Body() body: GenerateRequestDto, @Request() req): Promise<GenerateResponse> {
    console.log(`Received generate request with body:`, JSON.stringify(body));
    console.log(`Prompt value: ${body.prompt}`);
    console.log(`Prompt type: ${typeof body.prompt}`);
    console.log(`Prompt length: ${body.prompt ? body.prompt.length : 'undefined'}`);
    
    const userId = req.user.id;
    const prompt = body.prompt || 'Default business idea';
    
    // Generate slides
    const slides = await this.aiService.generatePitchDeck(prompt);
    console.log(`Generated ${slides.length} slides`);
    
    // Create project with generated slides
    try {
      const projectTitle = `Pitch Deck - ${new Date().toLocaleDateString()}`;
      const project = await this.projectsService.createProject(userId, {
        title: projectTitle,
        description: `Generated from prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`
      });
      
      console.log(`Created project with ID: ${project.id}`);
      
      return { 
        slides,
        projectId: project.id,
        projectTitle: project.title
      };
    } catch (error) {
      console.error('Failed to create project:', error);
      // Return slides even if project creation fails
      return { slides };
    }
  }

  @Get('test')
  @ApiOperation({ summary: 'Test OpenAI API connection' })
  async testApi() {
    try {
      const result = await this.aiService.generatePitchDeck('Test prompt');
      return { 
        status: 'success',
        message: 'OpenAI API is working',
        slidesGenerated: result.length
      };
    } catch (error) {
      return { 
        status: 'error',
        message: 'OpenAI API test failed',
        error: error.message 
      };
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  async healthCheck() {
    console.log('🏥 Health check endpoint called');
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      firebaseInitialized: !!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
    };
  }

  @Get('auth-test')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Test Firebase authentication' })
  async testAuth(@Request() req) {
    console.log('🔐 Auth test endpoint called');
    console.log('👤 User from request:', req.user);
    
    return {
      status: 'success',
      message: 'Firebase authentication is working',
      user: {
        id: req.user.id,
        email: req.user.email,
        firebaseUid: req.user.firebaseUid
      }
    };
  }
} 