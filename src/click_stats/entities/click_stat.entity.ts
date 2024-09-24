// src/click_stats/entities/click_stat.entity.ts
import { Campaign } from 'src/campaigns/entities/campaign.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('click_stats')
export class ClickStat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.clickStats, { onDelete: 'CASCADE' })
  campaign: Campaign;

  @Column({ length: 255 })
  link: string;

  @Column({ default: 0 })
  clickCount: number;

  @Column('text', { array: true, default: () => "'{}'" }) // Initialize with an empty array
  opened: string[];

  @Column('text', { array: true, default: () => "'{}'" }) // Initialize with an empty array
  clicked: string[];

  @CreateDateColumn()
  createdAt: Date;
}
