import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService, ProjectCreateDto } from './projects.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('projects')
@Controller('projects')
@UseGuards(FirebaseAuthGuard) // Enable Firebase auth
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body() projectData: ProjectCreateDto, @Request() req) {
    // Use authenticated user from Firebase
    const userId = req.user.id;
    return this.projectsService.createProject(userId, projectData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific project' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  async getProject(@Param('id') id: string, @Request() req) {
    const projectId = parseInt(id);
    // Use authenticated user from Firebase
    const userId = req.user.id;
    return this.projectsService.getProject(userId, projectId);
  }
} 