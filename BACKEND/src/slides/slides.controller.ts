import { Controller, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SlidesService, SlideUpdateDto } from './slides.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('slides')
@Controller('slides')
@UseGuards(FirebaseAuthGuard) // Enable Firebase auth
export class SlidesController {
  constructor(private slidesService: SlidesService) {}

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
} 