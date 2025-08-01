import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService, ProjectCreateDto, ProjectUpdateDto } from './projects.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('projects')
@Controller('projects')
@UseGuards(FirebaseAuthGuard) // Enable Firebase auth
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getProjects(@Request() req) {
    // Use authenticated user from Firebase
    const userId = req.user.id;
    return this.projectsService.getProjects(userId);
  }

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

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  async updateProject(@Param('id') id: string, @Body() updateData: ProjectUpdateDto, @Request() req) {
    const projectId = parseInt(id);
    const userId = req.user.id;
    return this.projectsService.updateProject(userId, projectId, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  async deleteProject(@Param('id') id: string, @Request() req) {
    const projectId = parseInt(id);
    const userId = req.user.id;
    return this.projectsService.deleteProject(userId, projectId);
  }
} 