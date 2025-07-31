import { Controller, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SlidesService, SlideUpdateDto } from './slides.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('slides')
@Controller('slides')
// @UseGuards(JwtAuthGuard) // Commented out for testing
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
    // Using dummy userId for testing since auth is disabled
    const dummyUserId = 1;
    return this.slidesService.updateSlide(dummyUserId, slideId, updateData);
  }
} 