import { Controller, Patch, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SlidesService, SlideUpdateDto, SlideCreateDto } from './slides.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('slides')
@Controller('slides')
@UseGuards(FirebaseAuthGuard) // Enable Firebase auth
export class SlidesController {
  constructor(private slidesService: SlidesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new slide' })
  @ApiResponse({ status: 201, description: 'Slide created successfully' })
  async createSlide(
    @Body() slideData: SlideCreateDto,
    @Request() req
  ) {
    // Use authenticated user from Firebase
    const userId = req.user.id;
    return this.slidesService.createSlide(userId, slideData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a slide' })
  @ApiResponse({ status: 200, description: 'Slide updated successfully' })
  async updateSlide(
    @Param('id') id: string,
    @Body() updateData: SlideUpdateDto,
    @Request() req
  ) {
    const slideId = parseInt(id);
    // Use authenticated user from Firebase
    const userId = req.user.id;
    return this.slidesService.updateSlide(userId, slideId, updateData);
  }

  @Patch('reorder/:projectId')
  @ApiOperation({ summary: 'Update slide positions for reordering' })
  @ApiResponse({ status: 200, description: 'Slide positions updated successfully' })
  async updateSlidePositions(
    @Param('projectId') projectId: string,
    @Body() slideUpdates: { id: number; position: number }[],
    @Request() req
  ) {
    const projectIdNum = parseInt(projectId);
    // Use authenticated user from Firebase
    const userId = req.user.id;
    return this.slidesService.updateSlidePositions(userId, projectIdNum, slideUpdates);
  }
} 