import { ClickStat } from 'src/click_stats/entities/click_stat.entity';
import { List } from 'src/lists/entities/list.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';


@Entity('campaigns')
export class Campaign {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    subject: string;

    @Column('text')
    content: string;

    @ManyToOne(() => List, list => list.campaigns, { onDelete: 'CASCADE' })
    list: List;

    @ManyToOne(() => Organization, organization => organization.campaigns, { onDelete: 'CASCADE' })
    organization: Organization;

    @OneToMany(() => ClickStat, clickStat => clickStat.campaign)
    clickStats: ClickStat[];

    @CreateDateColumn()
    createdAt: Date;
}