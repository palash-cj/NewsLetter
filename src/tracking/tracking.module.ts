import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClickStat } from 'src/click_stats/entities/click_stat.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ClickStat])
    ],
    controllers: [TrackingController],
    providers: [TrackingService],
    exports: [TrackingService],
})
export class TrackingModule {}
