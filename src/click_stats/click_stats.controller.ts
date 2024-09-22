import { Controller, Get, Post, Body, Param, Query, Res, HttpStatus, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClickStatService } from './click_stats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { CreateClickStatDto } from './dto/create-click_stat.dto';

@UseGuards(JwtAuthGuard)
@Controller('click-stats')
export class ClickStatController {
  constructor(private readonly clickStatService: ClickStatService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createClickStat(@Body() createClickStatDto: CreateClickStatDto) {
    return this.clickStatService.create(createClickStatDto);
  }

  // This route will handle link click tracking and redirection
  @Get('track')
  async trackClick(@Query('link') link: string, @Res() res: Response) {
      // Check if the link parameter is provided
      if (!link) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Link is required' });
      }
  
      try {
          const redirectUrl = await this.clickStatService.trackLinkClick(link, '', '', ''); // You can add IP and userAgent if needed
          return res.redirect(HttpStatus.FOUND, redirectUrl); // Redirect to the actual URL
      } catch (error) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }
  }

  // This route will handle open tracking with a transparent 1x1 pixel image
  @Get('track-open/:campaignId')
  async trackOpen(@Param('campaignId') campaignId: string, @Res() res: Response) {
    try {
      await this.clickStatService.trackOpen(campaignId);
      const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'); // 1x1 pixel gif
      res.setHeader('Content-Type', 'image/gif');
      return res.end(pixel, 'binary');
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
    }
  }
}
