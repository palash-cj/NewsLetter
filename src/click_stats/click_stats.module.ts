import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClickStatController } from './click_stats.controller';
import { ClickStatService } from './click_stats.service';
import { ClickStat } from './entities/click_stat.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClickStat, Campaign]),
    AuthModule
  ],
  controllers: [ClickStatController],
  providers: [ClickStatService],
  exports: [ClickStatService]
})
export class ClickStatsModule {}
