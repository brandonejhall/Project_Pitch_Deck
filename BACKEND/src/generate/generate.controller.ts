import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService, GenerateResponse } from '../ai/ai.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { ProjectsService } from '../projects/projects.service';
import { SlidesService } from '../slides/slides.service';
import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateRequestDto {
  prompt: string;
}

@ApiTags('generate')
@Controller('generate')
export class GenerateController {
  constructor(
    private aiService: AiService,
    private projectsService: ProjectsService,
    private slidesService: SlidesService
  ) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Generate pitch deck slides' })
  @ApiResponse({ status: 200, description: 'Slides generated successfully' })
  async generateSlides(@Body() body: GenerateRequestDto, @Request() req): Promise<GenerateResponse> {
    // console.log(`Received generate request with body:`, JSON.stringify(body));
    // console.log(`Prompt value: ${body.prompt}`);
    // console.log(`Prompt type: ${typeof body.prompt}`);
    // console.log(`Prompt length: ${body.prompt ? body.prompt.length : 'undefined'}`);
    
    const userId = req.user.id;
    const prompt = body.prompt || 'Default business idea';
    
    // Generate slides
    const slides = await this.aiService.generatePitchDeck(prompt);
    // console.log(`Generated ${slides.length} slides`);
    
    // Create project with generated slides
    try {
      // Generate a unique project title with timestamp
      const now = new Date();
      const timestamp = now.getTime();
      const dateStr = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      const projectTitle = `Pitch Deck - ${dateStr} at ${timeStr}`;
      const project = await this.projectsService.createProject(userId, {
        title: projectTitle,
        description: `Generated from prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`
      });
      
      // console.log(`Created project with ID: ${project.id}`);
      
      // Save generated slides to the database
      // console.log('Saving generated slides to database...');
      const savedSlides = [];
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        // console.log(`Processing slide ${i + 1}/${slides.length}:`, {
        //   title: slide.title,
        //   contentLength: slide.content.length,
        //   position: i + 1,
        //   projectId: project.id
        // });
        
        const savedSlide = await this.slidesService.createSlide(userId, {
          title: slide.title,
          content: slide.content,
          position: i + 1, // Position starts at 1
          projectId: project.id
        });
        savedSlides.push(savedSlide);
        // console.log(`✅ Saved slide ${i + 1}/${slides.length}: ${slide.title} (ID: ${savedSlide.id})`);
      }
      
      // console.log(`Successfully saved ${savedSlides.length} slides to database`);
      
      // Verify the slides were saved by fetching the project
      // console.log('Verifying saved slides...');
      const verifyProject = await this.projectsService.getProject(userId, project.id);
      // console.log(`Verified project has ${verifyProject.slides?.length || 0} slides`);
      
      return { 
        slides,
        projectId: project.id,
        projectTitle: project.title
      };
    } catch (error) {
      console.error('Failed to create project or save slides:', error);
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
    // console.log('🏥 Health check endpoint called');
    
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
    // console.log('🔐 Auth test endpoint called');
    // console.log('👤 User from request:', req.user);
    
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

  @Get('test-slides/:projectId')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Test endpoint to check project slides' })
  async testProjectSlides(@Param('projectId') projectId: string, @Request() req) {
    const userId = req.user.id;
    const projectIdNum = parseInt(projectId);
    
    try {
      const project = await this.projectsService.getProject(userId, projectIdNum);
      return {
        projectId: project.id,
        projectTitle: project.title,
        slidesCount: project.slides?.length || 0,
        slides: project.slides || []
      };
    } catch (error) {
      return {
        error: error.message,
        projectId: projectIdNum,
        slidesCount: 0,
        slides: []
      };
    }
  }
} 