import { Test, TestingModule } from '@nestjs/testing';
import { ClickStatService } from './click_stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClickStat } from './entities/click_stat.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { link } from 'fs';

const mockClickStatRepository = {
  save: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if campaign not found', async () => {
    const clickStatDto = { link: 'http://example.com', campaignId: 'b0b7792c-f1bb-4224-a340-2aeb47829023' };

    mockCampaignRepository.findOne.mockResolvedValue(null); // Campaign not found

    await expect(service.create(clickStatDto)).rejects.toThrow(NotFoundException);
    expect(mockCampaignRepository.findOne).toHaveBeenCalledWith({ where: { id: 'b0b7792c-f1bb-4224-a340-2aeb47829023' } });
    expect(mockClickStatRepository.create).not.toHaveBeenCalled();
    expect(mockClickStatRepository.save).not.toHaveBeenCalled();
  });

  it('should increment click count', async () => {
    const clickStat = { id: '1', link: 'http://example.com', clickCount: 1 };

    mockClickStatRepository.findOne.mockResolvedValue(clickStat);
    mockClickStatRepository.save.mockResolvedValue({ ...clickStat, clickCount: 2 });

    await service.incrementClickCount('http://example.com');

    expect(mockClickStatRepository.findOne).toHaveBeenCalledWith({ where: { link: 'http://example.com' } });
    expect(mockClickStatRepository.save).toHaveBeenCalledWith({ ...clickStat, clickCount: 2 });
  });

  it('should throw error when incrementing click count for a non-existing link', async () => {
    mockClickStatRepository.findOne.mockResolvedValue(null); // Link not found

    await expect(service.incrementClickCount('http://GOOGLE.com')).rejects.toThrow(NotFoundException);
    expect(mockClickStatRepository.findOne).toHaveBeenCalledWith({ where: { link: 'http://GOOGLE.com' } });
    expect(mockClickStatRepository.save).not.toHaveBeenCalled();
  });
});
