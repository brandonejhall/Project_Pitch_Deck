import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService, ProjectCreateDto } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('projects')
@Controller('projects')
// @UseGuards(JwtAuthGuard) // Commented out for testing
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  async createProject(@Body() projectData: ProjectCreateDto, @Request() req) {
    // Using dummy userId for testing since auth is disabled
    const dummyUserId = 1;
    return this.projectsService.createProject(dummyUserId, projectData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific project' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  async getProject(@Param('id') id: string, @Request() req) {
    const projectId = parseInt(id);
    // Using dummy userId for testing since auth is disabled
    const dummyUserId = 1;
    return this.projectsService.getProject(dummyUserId, projectId);
  }
} 