import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProjectCreateDto {
  title: string;
  slides: Array<{
    position: number;
    title: string;
    content: string;
  }>;
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(userId: number, projectData: ProjectCreateDto) {
    // Check if user already has a project
    const existingProject = await this.prisma.project.findFirst({
      where: { userId }
    });

    if (existingProject) {
      throw new BadRequestException('User already has a project');
    }

    // Create project with slides
    return this.prisma.project.create({
      data: {
        title: projectData.title,
        userId,
        slides: {
          create: projectData.slides.map((slide, index) => ({
            position: index,
            title: slide.title,
            content: slide.content
          }))
        }
      },
      include: {
        slides: {
          orderBy: { position: 'asc' }
        }
      }
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
} 