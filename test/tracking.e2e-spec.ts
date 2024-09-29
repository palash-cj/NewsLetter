// test/tracking.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TrackingModule } from '../src/tracking/tracking.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClickStat } from '../src/click_stats/entities/click_stat.entity';
import { Repository } from 'typeorm';

describe('TrackingController (e2e)', () => {
  let app: INestApplication;
  let clickStatRepository: Repository<ClickStat>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TrackingModule],
    })
      .overrideProvider(getRepositoryToken(ClickStat))
      .useValue({
        findOne: jest.fn().mockResolvedValue({
          id: '7cf7b3ce-1a70-48c1-ac01-d13ad2171ace',
          campaign: { id: '0f5d24c2-cc0e-463a-b427-729a4482ef99' },
          clicked: [],
          opened: [],
          link: 'https://www.google.co.uk/',
          clickCount: 0,
        }),
        save: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    clickStatRepository = moduleFixture.get<Repository<ClickStat>>(getRepositoryToken(ClickStat));
  });

  it('/tracking/:campaignId/:linkId/click/:email (GET)', () => {
    return request(app.getHttpServer())
      .get('/tracking/test-campaign-id/test-link-id/click/palashjemi@gmail.com')
      .expect(302) // Check for redirection
      .expect('Location', 'https://www.google.co.uk/'); // Ensure redirect URL is correct
  });

  it('/tracking/:campaignId/:linkId/open/:email (GET)', () => {
    return request(app.getHttpServer())
      .get('/tracking/test-campaign-id/test-link-id/open/palashjemi@gmail.com')
      .expect(200) // Check if the 1x1 tracking pixel is served
      .expect('Content-Type', /image\/gif/); // Ensure the correct image type is returned
  });

  afterAll(async () => {
    await app.close();
  });
});
