import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SlideUpdateDto {
  title?: string;
  content?: string;
  position?: number;
}

export interface SlideCreateDto {
  title: string;
  content: string;
  position: number;
  projectId: number;
}

@Injectable()
export class SlidesService {
  constructor(private prisma: PrismaService) {}

  async createSlide(userId: number, slideData: SlideCreateDto) {
    // Verify the project belongs to the user
    const project = await this.prisma.project.findFirst({
      where: {
        id: slideData.projectId,
        userId
      }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Create the slide
    return this.prisma.slide.create({
      data: {
        title: slideData.title,
        content: slideData.content,
        position: slideData.position,
        projectId: slideData.projectId
      }
    });
  }

  async updateSlide(userId: number, slideId: number, updateData: SlideUpdateDto) {
    // Find the slide and verify it belongs to the user
    const slide = await this.prisma.slide.findFirst({
      where: {
        id: slideId,
        project: {
          userId
        }
      }
    });

    if (!slide) {
      throw new NotFoundException('Slide not found');
    }

    // Update the slide
    return this.prisma.slide.update({
      where: { id: slideId },
      data: {
        ...(updateData.title !== undefined && { title: updateData.title }),
        ...(updateData.content !== undefined && { content: updateData.content }),
        ...(updateData.position !== undefined && { position: updateData.position })
      }
    });
  }
} 