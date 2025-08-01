import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProjectCreateDto {
  title: string;
  description?: string;
}

export interface ProjectUpdateDto {
  title?: string;
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: number, projectData: ProjectCreateDto) {
    // Create project
    return this.prisma.project.create({
      data: {
        title: projectData.title,
        userId,
      }
    });
  }

  async getProjects(userId: number) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProject(userId: number, projectId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      },
      include: {
        slides: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateProject(userId: number, projectId: number, updateData: ProjectUpdateDto) {
    // Verify project exists and belongs to user
    const existingProject = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    // Update project
    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        title: updateData.title,
        updatedAt: new Date()
      }
    });
  }

  async deleteProject(userId: number, projectId: number) {
    // Verify project exists and belongs to user
    const existingProject = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    // Delete project (this will cascade delete slides due to Prisma schema)
    return this.prisma.project.delete({
      where: { id: projectId }
    });
  }
} 