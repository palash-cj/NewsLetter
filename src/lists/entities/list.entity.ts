import { Campaign } from 'src/campaigns/entities/campaign.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';

@Entity('lists')
export class List {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @ManyToOne(() => Organization, organization => organization.lists, { onDelete: 'CASCADE' })
    organization: Organization;

    @Column('jsonb', { nullable: true })
    customFields: object;

    @OneToMany(() => Campaign, campaign => campaign.list)
    campaigns: Campaign[];

    @CreateDateColumn()
    createdAt: Date;
}
