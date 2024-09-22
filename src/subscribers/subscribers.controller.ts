import { Controller, Get, Post, Body, Put, Param, Query, UseGuards } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriberService } from './subscribers.service';

@Controller('subscribers')
@UseGuards(JwtAuthGuard)
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) { }

  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscriberService.create(createSubscriberDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.subscriberService.findAll(page, limit);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
    return this.subscriberService.update(id, updateSubscriberDto);
  }
}