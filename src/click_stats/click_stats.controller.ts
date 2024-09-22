import { Controller, Get, Post, Body, Query, Res, HttpStatus, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClickStatService } from './click_stats.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { CreateClickStatDto } from './dto/create-click_stat.dto';

@UseGuards(JwtAuthGuard)
@Controller('click-stats')
export class ClickStatController {
  constructor(private readonly clickStatService: ClickStatService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))// validating the payload
  async createClickStat(@Body() createClickStatDto: CreateClickStatDto) {
    return this.clickStatService.create(createClickStatDto);
  }

  // Route to handle link click tracking and redirection
  @Get('track')
  async trackClick(@Query('link') link: string, @Res() res: Response) {
      // Checking if the link is provided
      if (!link) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Link is required' });
      }
  
      try {
          const redirectUrl = await this.clickStatService.trackLinkClick(link, '', '', ''); 
          return res.redirect(HttpStatus.FOUND, redirectUrl); // Redirecting user to the link
      } catch (error) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      }
  }

}
