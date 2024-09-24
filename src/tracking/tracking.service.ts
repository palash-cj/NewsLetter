import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClickStat } from 'src/click_stats/entities/click_stat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(ClickStat)
        private clickStatRepository: Repository<ClickStat>,
    ){}

    async logClick(campaignId: string, linkId: string, email: string) {
        let clickStat = await this.clickStatRepository.findOne({
            where: { id: linkId }, // Update link as needed
        });        
        if (!clickStat) {
            throw new NotFoundException('ClickStat not found');
        }
        if (!clickStat.clicked.includes(email)) {
            clickStat.clicked.push(email);
            clickStat.clickCount += 1;
        }
        // Here, you would store the click event in your database (e.g., ClickStat entity)
        await this.clickStatRepository.save(clickStat);
        return clickStat.link;
    }

    async logOpen(campaignId: string, linkId: string, email: string) {
        // Here, you would store the open event in your database (e.g., OpenStat entity)
        let clickStat = await this.clickStatRepository.findOne({
            where: {
                id: linkId, // Ensure linkId is valid
            },
            relations: ['campaign'], // Optional: Load related campaign data if needed
        });        
        if (!clickStat) {
            throw new NotFoundException('ClickStat not found');
        }
        console.log(email, clickStat.opened.includes(email));
        if (!clickStat.opened.includes(email)) {
            clickStat.opened.push(email);
        }
        return this.clickStatRepository.save(clickStat);;
    }
}
