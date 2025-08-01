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
  @UseGuards(FirebaseAuthGuard) // Enable Firebase auth
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