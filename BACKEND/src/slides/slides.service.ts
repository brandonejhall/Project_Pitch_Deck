import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SlideUpdateDto {
  title?: string;
  content?: string;
  position?: number;
}

@Injectable()
export class SlidesService {
  constructor(private prisma: PrismaService) {}

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