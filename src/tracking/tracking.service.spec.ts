import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';
import { ClickStat } from 'src/click_stats/entities/click_stat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TrackingService', () => {
  let service: TrackingService;
  let repository: Repository<ClickStat>;

  const mockClickStatRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockClickStat = {
    id: '7cf7b3ce-1a70-48c1-ac01-d13ad2171ace',
    link: 'https://www.google.co.uk/',
    clickCount: 0,
    clicked: [],
    opened: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        {
          provide: getRepositoryToken(ClickStat),
          useValue: mockClickStatRepository,
        },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    repository = module.get<Repository<ClickStat>>(getRepositoryToken(ClickStat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logClick', () => {
    it('should increase clickCount and add email if not already present', async () => {
      mockClickStatRepository.findOne.mockResolvedValue(mockClickStat);
      mockClickStatRepository.save.mockResolvedValue(mockClickStat);

      await service.logClick('test-campaign-id', 'test-link-id', 'test-email@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'test-link-id' } });
      expect(mockClickStat.clicked).toContain('test-email@example.com');
      expect(mockClickStat.clickCount).toBe(1);
    });

    it('should throw NotFoundException if ClickStat is not found', async () => {
      mockClickStatRepository.findOne.mockResolvedValue(null);

      await expect(
        service.logClick('test-campaign-id', 'test-link-id', 'test-email@example.com')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('logOpen', () => {
    it('should add email to opened array if not already present', async () => {
      mockClickStatRepository.findOne.mockResolvedValue(mockClickStat);
      mockClickStatRepository.save.mockResolvedValue(mockClickStat);

      await service.logOpen('test-campaign-id', 'test-link-id', 'test-email@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-link-id' },
        relations: ['campaign'],
      });
      expect(mockClickStat.opened).toContain('test-email@example.com');
    });

    it('should throw NotFoundException if ClickStat is not found', async () => {
      mockClickStatRepository.findOne.mockResolvedValue(null);

      await expect(
        service.logOpen('test-campaign-id', 'test-link-id', 'test-email@example.com')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
