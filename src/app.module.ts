// src/app.module.ts
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './organizations/organizations.module';
import { UserModule } from './users/users.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ListsModule } from './lists/lists.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ClickStatsModule } from './click_stats/click_stats.module';
import { AuthModule } from './auth/auth.module';
import { Campaign } from './campaigns/entities/campaign.entity';
import { List } from './lists/entities/list.entity';
import { ClickStat } from './click_stats/entities/click_stat.entity';
import { Organization } from './organizations/entities/organization.entity';
import { Subscriber } from './subscribers/entities/subscriber.entity';
import { User } from './users/entities/user.entity';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task.module';
import { TrackingModule } from './tracking/tracking.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 8101,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydatabase',
      entities: [Campaign, ClickStat, List, Organization, Subscriber, User],
      synchronize: true,
    }),
    OrganizationsModule,
    UserModule,
    SubscribersModule,
    ListsModule,
    CampaignsModule,
    ClickStatsModule,
    AuthModule,
    EmailModule,
    ScheduleModule.forRoot(), 
    TasksModule,
    TrackingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
