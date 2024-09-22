import { Test, TestingModule } from '@nestjs/testing';
import { ClickStatService } from './click_stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClickStat } from './entities/click_stat.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';


const mockClickStatRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockCampaignRepository = {
  findOne: jest.fn(),
};

describe('ClickStatService', () => {
  let service: ClickStatService;
  let clickStatRepository: Repository<ClickStat>;
  let campaignRepository: Repository<Campaign>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClickStatService,
        {
          provide: getRepositoryToken(ClickStat),
          useValue: mockClickStatRepository,
        },
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
      ],
    }).compile();

    service = module.get<ClickStatService>(ClickStatService);
    clickStatRepository = module.get<Repository<ClickStat>>(getRepositoryToken(ClickStat));
    campaignRepository = module.get<Repository<Campaign>>(getRepositoryToken(Campaign));
  });

  it('should create a new click stat', async () => {
    const clickStatDto = { link: 'http://example.com', campaignId: '123' };
    const campaign = { id: '123', name: 'Test Campaign' };
    mockCampaignRepository.findOne.mockResolvedValue(campaign);

    await service.create(clickStatDto);
    expect(mockClickStatRepository.save).toHaveBeenCalled();
  });

  it('should increment click count', async () => {
    const clickStat = { id: '1', link: 'http://example.com', clickCount: 1 };
    mockClickStatRepository.findOne.mockResolvedValue(clickStat);

    await service.incrementClickCount('http://example.com');
    expect(mockClickStatRepository.save).toHaveBeenCalledWith({ ...clickStat, clickCount: 2 });
  });
});
