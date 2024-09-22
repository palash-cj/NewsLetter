import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClickStat } from './entities/click_stat.entity';
import { CreateClickStatDto } from './dto/create-click_stat.dto';
import { Campaign } from '../campaigns/entities/campaign.entity';

@Injectable()
export class ClickStatService {
  constructor(
    @InjectRepository(ClickStat)
    private clickStatRepository: Repository<ClickStat>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>
  ) {}

  // Creating a new click stat
  async create(createClickStatDto: CreateClickStatDto) {
    const existingClickStat = await this.clickStatRepository.findOne({ where: { link: createClickStatDto.link } });
    if (existingClickStat) {
        throw new ConflictException('ClickStat with this link already exists');
    }

    const clickStat = new ClickStat();
    clickStat.link = createClickStatDto.link;
    clickStat.clickCount = createClickStatDto.clickCount || 0;

    if (createClickStatDto.campaignId) {
      const campaign = await this.campaignRepository.findOne({
        where: { id: createClickStatDto.campaignId },
      });
      if (campaign) {
        clickStat.campaign = campaign;
      } else {
        throw new NotFoundException('Campaign not found');
      }
    } else {
      throw new Error('Campaign ID is required');
    }

    return this.clickStatRepository.save(clickStat);
  }

  // Increment click count
  async incrementClickCount(link: string) {
    const clickStat = await this.clickStatRepository.findOne({ where: { link } });
    if (!clickStat) {
      throw new NotFoundException('ClickStat not found');
    }
    clickStat.clickCount += 1;
    return this.clickStatRepository.save(clickStat);
  }

  // Handle the redirection logic and counting click
  async trackLinkClick(link: string, ip: string, userAgent: string, campaignId: string) {
    const clickStat = await this.clickStatRepository.findOne({ where: { link } });
    if (!clickStat) {
      throw new NotFoundException('ClickStat not found for the provided link');
    }

    // Increment the click count
    clickStat.clickCount += 1;
    await this.clickStatRepository.save(clickStat);

    // You could also log or store the `ip` and `userAgent` information if needed

    return clickStat.link; // This is the URL that the link corresponds to
  }

  // Handle the open tracking logic
  async trackOpen(campaignId: string) {
    const openLink = await this.clickStatRepository.findOne({
      where: { campaign: { id: campaignId } },
    });

    if (!openLink) {
      throw new NotFoundException('No open tracking link found for the campaign');
    }

    openLink.clickCount += 1; // Increment open count
    await this.clickStatRepository.save(openLink);
  }
}
